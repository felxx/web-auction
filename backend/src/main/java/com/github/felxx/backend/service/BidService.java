package com.github.felxx.backend.service;

import com.github.felxx.backend.dto.bid.BidRequestDTO;
import com.github.felxx.backend.dto.bid.BidResponseDTO;
import com.github.felxx.backend.dto.websocket.BidNotificationDTO;
import com.github.felxx.backend.exception.BusinessException;
import com.github.felxx.backend.exception.NotFoundException;
import com.github.felxx.backend.model.Auction;
import com.github.felxx.backend.model.AuctionStatus;
import com.github.felxx.backend.model.Bid;
import com.github.felxx.backend.model.Person;
import com.github.felxx.backend.repository.AuctionRepository;
import com.github.felxx.backend.repository.BidRepository;
import com.github.felxx.backend.repository.PersonRepository;
import io.micrometer.core.annotation.Counted;
import io.micrometer.core.annotation.Timed;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.Comparator;
import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class BidService {

    private final BidRepository bidRepository;
    private final PersonRepository personRepository;
    private final AuctionRepository auctionRepository;
    private final SimpMessagingTemplate messagingTemplate;

    @Transactional
    @Timed(value = "bids.create.time", description = "Tempo de criação de lance")
    @Counted(value = "bids.create.count", description = "Quantidade de lances criados")
    public BidResponseDTO insert(BidRequestDTO requestDTO) {
        log.info("Processing new bid for auction ID: {} with amount: {}", requestDTO.getAuctionId(), requestDTO.getAmount());
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String currentUserEmail = authentication.getName();
        
        Person bidder = personRepository.findByEmail(currentUserEmail)
                .orElseThrow(() -> new NotFoundException("Person not found"));
        
        Auction auction = auctionRepository.findById(requestDTO.getAuctionId())
                .orElseThrow(() -> new NotFoundException("Auction not found"));
        
        if (auction.getStatus() == AuctionStatus.SCHEDULED) {
            log.warn("Bid rejected - Auction {} has not started yet", auction.getId());
            throw new BusinessException("Auction has not started yet");
        }
        
        if (auction.getStatus() != AuctionStatus.OPEN) {
            log.warn("Bid rejected - Auction {} is not open for bidding", auction.getId());
            throw new BusinessException("Auction is not open for bidding");
        }
        
        LocalDateTime now = LocalDateTime.now();
        
        if (auction.getStartDateTime().isAfter(now)) {
            log.warn("Bid rejected - Auction {} has not started yet", auction.getId());
            throw new BusinessException("Auction has not started yet");
        }
        
        if (auction.getEndDateTime().isBefore(now)) {
            log.warn("Bid rejected - Auction {} has ended", auction.getId());
            throw new BusinessException("Auction has ended");
        }
        
        if (auction.getPublisher().getId().equals(bidder.getId())) {
            log.warn("Bid rejected - Publisher attempting to bid on own auction {}", auction.getId());
            throw new BusinessException("Publisher cannot bid on their own auction");
        }
        
        List<Bid> existingBids = bidRepository.findByAuctionIdOrderByAmountDesc(auction.getId());
        if (!existingBids.isEmpty()) {
            Float highestBid = existingBids.get(0).getAmount();
            if (requestDTO.getAmount() <= highestBid) {
                log.warn("Bid rejected - Amount {} is not higher than current highest bid {}", requestDTO.getAmount(), highestBid);
                throw new BusinessException("Bid amount must be higher than current highest bid: " + highestBid);
            }
        } else if (requestDTO.getAmount() < auction.getMinimumBid()) {
            log.warn("Bid rejected - Amount {} is below minimum bid {}", requestDTO.getAmount(), auction.getMinimumBid());
            throw new BusinessException("Bid amount must be at least the minimum bid: " + auction.getMinimumBid());
        }
        
        Bid bid = new Bid();
        bid.setAmount(requestDTO.getAmount());
        bid.setBidDateTime(LocalDateTime.now());
        bid.setBidder(bidder);
        bid.setAuction(auction);
        
        Bid savedBid = bidRepository.save(bid);
        
        Float currentPrice = auction.getBids().stream()
                .map(Bid::getAmount)
                .max(Comparator.naturalOrder())
                .orElse(auction.getMinimumBid());
        
        BidNotificationDTO notification = new BidNotificationDTO(
                auction.getId(),
                savedBid.getId(),
                savedBid.getAmount(),
                bidder.getName(),
                savedBid.getBidDateTime(),
                currentPrice,
                auction.getBids().size()
        );
        
        messagingTemplate.convertAndSend("/topic/auction/" + auction.getId(), notification);
        
        return toResponseDTO(savedBid);
    }

    @Transactional
    public void delete(Long id) {
        Bid bid = findById(id);
        
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String currentUserEmail = authentication.getName();
        boolean isAdmin = authentication.getAuthorities().stream()
                .anyMatch(auth -> auth.getAuthority().equals("ADMIN"));
        
        if (!isAdmin && !bid.getBidder().getEmail().equals(currentUserEmail)) {
            throw new BusinessException("You can only delete your own bids");
        }
        
        bidRepository.delete(bid);
    }

    public Bid findById(Long id) {
        return bidRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Bid not found with id: " + id));
    }

    public Page<BidResponseDTO> findAll(Pageable pageable) {
        return bidRepository.findAll(pageable).map(this::toResponseDTO);
    }
    
    public Page<BidResponseDTO> findByAuctionId(Long auctionId, Pageable pageable) {
        return bidRepository.findByAuctionId(auctionId, pageable).map(this::toResponseDTO);
    }
    
    public BidResponseDTO toResponseDTO(Bid bid) {
        BidResponseDTO dto = new BidResponseDTO();
        dto.setId(bid.getId());
        dto.setAmount(bid.getAmount());
        dto.setBidDateTime(bid.getBidDateTime());
        dto.setBidderId(bid.getBidder().getId());
        dto.setBidderName(bid.getBidder().getName());
        dto.setAuctionId(bid.getAuction().getId());
        dto.setAuctionTitle(bid.getAuction().getTitle());
        return dto;
    }
}