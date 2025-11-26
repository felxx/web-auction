package com.github.felxx.backend.service;

import com.github.felxx.backend.dto.feedback.FeedbackRequestDTO;
import com.github.felxx.backend.dto.feedback.FeedbackResponseDTO;
import com.github.felxx.backend.exception.BusinessException;
import com.github.felxx.backend.exception.NotFoundException;
import com.github.felxx.backend.model.Feedback;
import com.github.felxx.backend.model.Person;
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

    @Transactional
    public FeedbackResponseDTO insert(FeedbackRequestDTO requestDTO) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String currentUserEmail = authentication.getName();
        
        Person writer = personRepository.findByEmail(currentUserEmail)
                .orElseThrow(() -> new NotFoundException("Writer not found"));
        
        Person recipient = personRepository.findById(requestDTO.getRecipientId())
                .orElseThrow(() -> new NotFoundException("Recipient not found"));
        
        // Business rules
        if (writer.getId().equals(recipient.getId())) {
            throw new BusinessException("You cannot give feedback to yourself");
        }
        
        Feedback feedback = new Feedback();
        feedback.setComment(requestDTO.getComment());
        feedback.setRating(requestDTO.getRating());
        feedback.setCreatedAt(LocalDateTime.now());
        feedback.setWriter(writer);
        feedback.setRecipient(recipient);
        
        Feedback savedFeedback = feedbackRepository.save(feedback);
        
        return toResponseDTO(savedFeedback);
    }

    @Transactional
    public FeedbackResponseDTO update(Long id, FeedbackRequestDTO requestDTO) {
        Feedback existingFeedback = findById(id);
        
        // Only the writer can update their feedback
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
        
        // Only the writer or admin can delete
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
