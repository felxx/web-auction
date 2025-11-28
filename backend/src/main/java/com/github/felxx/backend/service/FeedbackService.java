package com.github.felxx.backend.service;

import com.github.felxx.backend.dto.feedback.FeedbackRequestDTO;
import com.github.felxx.backend.dto.feedback.FeedbackResponseDTO;
import com.github.felxx.backend.exception.BusinessException;
import com.github.felxx.backend.exception.NotFoundException;
import com.github.felxx.backend.model.Feedback;
import com.github.felxx.backend.model.Person;
import com.github.felxx.backend.model.Auction;
import com.github.felxx.backend.model.AuctionStatus;
import com.github.felxx.backend.model.Bid;
import com.github.felxx.backend.repository.AuctionRepository;
import java.util.Comparator;
import com.github.felxx.backend.repository.FeedbackRepository;
import com.github.felxx.backend.repository.PersonRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class FeedbackService {

    private final FeedbackRepository feedbackRepository;
    private final PersonRepository personRepository;
    private final AuctionRepository auctionRepository;

    @Transactional
    public FeedbackResponseDTO insert(FeedbackRequestDTO requestDTO) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String currentUserEmail = authentication.getName();
        
        Person writer = personRepository.findByEmail(currentUserEmail)
                .orElseThrow(() -> new NotFoundException("Writer not found"));
        
        if (requestDTO.getAuctionId() == null) {
             throw new BusinessException("Auction ID is required");
        }

        Auction auction = auctionRepository.findById(requestDTO.getAuctionId())
                .orElseThrow(() -> new NotFoundException("Auction not found"));

        if (auction.getStatus() != AuctionStatus.CLOSED) {
            throw new BusinessException("Feedback can only be given for closed auctions");
        }

        Bid winningBid = auction.getBids().stream()
                .max(Comparator.comparing(Bid::getAmount))
                .orElseThrow(() -> new BusinessException("This auction has no bids"));

        if (!winningBid.getBidder().getId().equals(writer.getId())) {
             throw new BusinessException("Only the auction winner can leave feedback");
        }

        if (feedbackRepository.existsByWriterIdAndAuctionId(writer.getId(), requestDTO.getAuctionId())) {
            throw new BusinessException("You have already left feedback for this auction");
        }

        Person recipient = auction.getPublisher();
        
        if (writer.getId().equals(recipient.getId())) {
            throw new BusinessException("You cannot give feedback to yourself");
        }
        
        Feedback feedback = new Feedback();
        feedback.setComment(requestDTO.getComment());
        feedback.setRating(requestDTO.getRating());
        feedback.setCreatedAt(LocalDateTime.now());
        feedback.setWriter(writer);
        feedback.setRecipient(recipient);
        feedback.setAuctionId(auction.getId());
        
        Feedback savedFeedback = feedbackRepository.save(feedback);
        
        return toResponseDTO(savedFeedback);
    }

    @Transactional
    public FeedbackResponseDTO update(Long id, FeedbackRequestDTO requestDTO) {
        Feedback existingFeedback = findById(id);
        
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String currentUserEmail = authentication.getName();
        
        if (!existingFeedback.getWriter().getEmail().equals(currentUserEmail)) {
            boolean isAdmin = authentication.getAuthorities().stream()
                    .anyMatch(auth -> auth.getAuthority().equals("ADMIN"));
            if (!isAdmin) {
                throw new BusinessException("You can only update your own feedback");
            }
        }
        
        existingFeedback.setComment(requestDTO.getComment());
        existingFeedback.setRating(requestDTO.getRating());
        
        Feedback savedFeedback = feedbackRepository.save(existingFeedback);
        
        return toResponseDTO(savedFeedback);
    }

    @Transactional
    public void delete(Long id) {
        Feedback feedback = findById(id);
        
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String currentUserEmail = authentication.getName();
        boolean isAdmin = authentication.getAuthorities().stream()
                .anyMatch(auth -> auth.getAuthority().equals("ADMIN"));
        
        if (!isAdmin && !feedback.getWriter().getEmail().equals(currentUserEmail)) {
            throw new BusinessException("You can only delete your own feedback");
        }
        
        feedbackRepository.delete(feedback);
    }

    public Feedback findById(Long id) {
        return feedbackRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Feedback not found with id: " + id));
    }

    public Page<FeedbackResponseDTO> findAll(Pageable pageable) {
        return feedbackRepository.findAll(pageable).map(this::toResponseDTO);
    }

    public Page<FeedbackResponseDTO> findByRecipient(Long recipientId, Pageable pageable) {
        return feedbackRepository.findByRecipientId(recipientId, pageable).map(this::toResponseDTO);
    }

    public Page<FeedbackResponseDTO> findByWriter(Long writerId, Pageable pageable) {
        return feedbackRepository.findByWriterId(writerId, pageable).map(this::toResponseDTO);
    }
    
    public FeedbackResponseDTO toResponseDTO(Feedback feedback) {
        FeedbackResponseDTO dto = new FeedbackResponseDTO();
        dto.setId(feedback.getId());
        dto.setComment(feedback.getComment());
        dto.setRating(feedback.getRating());
        dto.setCreatedAt(feedback.getCreatedAt());
        dto.setWriterId(feedback.getWriter().getId());
        dto.setWriterName(feedback.getWriter().getName());
        dto.setRecipientId(feedback.getRecipient().getId());
        dto.setRecipientName(feedback.getRecipient().getName());
        return dto;
    }
}
