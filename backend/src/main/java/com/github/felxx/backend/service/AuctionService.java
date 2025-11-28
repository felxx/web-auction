package com.github.felxx.backend.service;

import io.micrometer.core.annotation.Counted;
import io.micrometer.core.annotation.Timed;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.transaction.annotation.Transactional;

import com.github.felxx.backend.dto.auction.AuctionDetailDTO;
import com.github.felxx.backend.dto.auction.AuctionRequestDTO;
import com.github.felxx.backend.dto.auction.AuctionResponseDTO;
import com.github.felxx.backend.dto.auction.PublicAuctionResponseDTO;
import com.github.felxx.backend.dto.websocket.AuctionStatusUpdateDTO;
import com.github.felxx.backend.exception.NotFoundException;
import com.github.felxx.backend.model.Auction;
import com.github.felxx.backend.model.AuctionStatus;
import com.github.felxx.backend.model.Bid;
import com.github.felxx.backend.model.Category;
import com.github.felxx.backend.model.Feedback;
import com.github.felxx.backend.model.Person;
import com.github.felxx.backend.repository.AuctionRepository;
import com.github.felxx.backend.repository.BidRepository;
import com.github.felxx.backend.repository.CategoryRepository;
import com.github.felxx.backend.repository.FeedbackRepository;
import com.github.felxx.backend.repository.PersonRepository;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import java.time.LocalDateTime;
import java.util.Comparator;
import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class AuctionService {
    
    private final AuctionRepository auctionRepository;
    private final CategoryRepository categoryRepository;
    private final PersonRepository personRepository;
    private final BidRepository bidRepository;
    private final FeedbackRepository feedbackRepository;
    private final SimpMessagingTemplate messagingTemplate;

    @Scheduled(fixedRate = 5000)
    @Transactional
    public void checkAndUpdateAuctionStatuses() {
        LocalDateTime now = LocalDateTime.now();
        log.info("=== Auction Status Scheduler running at: {} ===", now);
        
        List<Auction> scheduledAuctions = auctionRepository.findAllByStatusAndStartDateTimeBefore(
                AuctionStatus.SCHEDULED, now);
        if (!scheduledAuctions.isEmpty()) {
            log.info("Found {} scheduled auctions to open", scheduledAuctions.size());
        }
        for (Auction auction : scheduledAuctions) {
            log.info("Opening auction ID: {} - {}", auction.getId(), auction.getTitle());
            auction.setStatus(AuctionStatus.OPEN);
            auctionRepository.save(auction);
            
            AuctionStatusUpdateDTO statusUpdate = new AuctionStatusUpdateDTO(
                    auction.getId(),
                    AuctionStatus.OPEN,
                    LocalDateTime.now()
            );
            messagingTemplate.convertAndSend("/topic/auction/" + auction.getId() + "/status", statusUpdate);
        }
        
        List<Auction> expiredAuctions = auctionRepository.findAllByStatusAndEndDateTimeBefore(
                AuctionStatus.OPEN, now);
        if (!expiredAuctions.isEmpty()) {
            log.info("Found {} open auctions to close", expiredAuctions.size());
        }
        for (Auction auction : expiredAuctions) {
            log.info("Closing auction ID: {} - {}", auction.getId(), auction.getTitle());
            auction.setStatus(AuctionStatus.CLOSED);
            auctionRepository.save(auction);
            
            AuctionStatusUpdateDTO statusUpdate = new AuctionStatusUpdateDTO(
                    auction.getId(),
                    AuctionStatus.CLOSED,
                    LocalDateTime.now()
            );
            messagingTemplate.convertAndSend("/topic/auction/" + auction.getId() + "/status", statusUpdate);
        }
        
        log.info("=== Scheduler finished ===");
    }

    @Transactional
    @Timed(value = "auctions.create.time", description = "Tempo de criação de leilão")
    @Counted(value = "auctions.create.count", description = "Quantidade de leilões criados")
    public AuctionResponseDTO insert(AuctionRequestDTO requestDTO) {
        log.info("Inserting new auction: {}", requestDTO.getTitle());
        Auction auction = new Auction();
        mapDTOToEntity(requestDTO, auction);
        
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication != null && authentication.isAuthenticated()) {
            String email = authentication.getName();
            Person publisher = personRepository.findByEmail(email)
                    .orElseThrow(() -> new NotFoundException("User not found"));
            auction.setPublisher(publisher);
        }
        
        Auction savedAuction = auctionRepository.save(auction);
        log.info("Auction created successfully with ID: {}", savedAuction.getId());
        return toResponseDTO(savedAuction);
    }

    @Transactional
    @Timed(value = "auctions.update.time", description = "Tempo de atualização de leilão")
    @Counted(value = "auctions.update.count", description = "Quantidade de leilões atualizados")
    public AuctionResponseDTO update(Long id, AuctionRequestDTO requestDTO) {
        log.info("Updating auction with ID: {}", id);
        Auction existingAuction = findById(id);
        mapDTOToEntity(requestDTO, existingAuction);
        Auction updatedAuction = auctionRepository.save(existingAuction);
        log.info("Auction updated successfully: {}", id);
        return toResponseDTO(updatedAuction);
    }

    @Transactional
    @Counted(value = "auctions.delete.count", description = "Quantidade de leilões deletados")
    public void delete(Long id) {
        log.info("Deleting auction with ID: {}", id);
        Auction auction = findById(id);
        auctionRepository.delete(auction);
        log.info("Auction deleted successfully: {}", id);
    }

    public Auction findById(Long id) {
        return auctionRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Auction not found with id: " + id));
    }

    public AuctionResponseDTO findByIdDTO(Long id) {
        Auction auction = findById(id);
        return toResponseDTO(auction);
    }

    public Page<AuctionResponseDTO> findAll(Pageable pageable) {
        return auctionRepository.findAll(pageable).map(this::toResponseDTO);
    }

    public Page<AuctionResponseDTO> findByFilters(
            String status,
            Long categoryId,
            LocalDateTime startDate,
            LocalDateTime endDate,
            String search,
            Pageable pageable) {
        
        AuctionStatus auctionStatus = null;
        if (status != null && !status.trim().isEmpty()) {
            try {
                auctionStatus = AuctionStatus.valueOf(status.toUpperCase());
            } catch (IllegalArgumentException e) {
            }
        }
        
        return auctionRepository.findByFilters(
                auctionStatus,
                categoryId,
                startDate,
                endDate,
                search,
                pageable
        ).map(this::toResponseDTO);
    }

    private void mapDTOToEntity(AuctionRequestDTO dto, Auction auction) {
        auction.setTitle(dto.getTitle());
        auction.setDescription(dto.getDescription());
        auction.setStartDateTime(dto.getStartDateTime());
        auction.setEndDateTime(dto.getEndDateTime());
        auction.setMinimumBid(dto.getMinimumBid());
        
        if (auction.getStatus() == null) {
            LocalDateTime now = LocalDateTime.now();
            if (dto.getStartDateTime().isAfter(now)) {
                auction.setStatus(AuctionStatus.SCHEDULED);
            } else if (dto.getEndDateTime().isBefore(now)) {
                auction.setStatus(AuctionStatus.CLOSED);
            } else {
                auction.setStatus(AuctionStatus.OPEN);
            }
        }
        
        if (dto.getCategoryId() != null) {
            Category category = categoryRepository.findById(dto.getCategoryId())
                    .orElseThrow(() -> new NotFoundException("Category not found with id: " + dto.getCategoryId()));
            auction.setCategory(category);
        }
    }

    private AuctionResponseDTO toResponseDTO(Auction auction) {
        AuctionResponseDTO dto = new AuctionResponseDTO();
        dto.setId(auction.getId());
        dto.setTitle(auction.getTitle());
        dto.setDescription(auction.getDescription());
        dto.setStartDateTime(auction.getStartDateTime());
        dto.setEndDateTime(auction.getEndDateTime());
        dto.setStatus(auction.getStatus() != null ? auction.getStatus().name() : null);
        dto.setNotes(auction.getNotes());
        dto.setMinimumBid(auction.getMinimumBid());
        
        if (auction.getCategory() != null) {
            dto.setCategoryId(auction.getCategory().getId());
            dto.setCategoryName(auction.getCategory().getName());
        }
        
        if (auction.getPublisher() != null) {
            dto.setPublisherId(auction.getPublisher().getId());
            dto.setPublisherName(auction.getPublisher().getName());
        }
        
        if (auction.getBids() != null) {
            dto.setTotalBids(auction.getBids().size());
        } else {
            dto.setTotalBids(0);
        }
        
        if (auction.getImages() != null && !auction.getImages().isEmpty()) {
            auction.getImages().stream()
                .min((img1, img2) -> {
                    if (img1.getDisplayOrder() != null && img2.getDisplayOrder() != null) {
                        return img1.getDisplayOrder().compareTo(img2.getDisplayOrder());
                    }
                    if (img1.getUploadedAt() == null) return 1;
                    if (img2.getUploadedAt() == null) return -1;
                    return img1.getUploadedAt().compareTo(img2.getUploadedAt());
                })
                .ifPresent(mainImage -> dto.setMainImageId(mainImage.getId()));
        }
        
        if (auction.getBids() != null && !auction.getBids().isEmpty()) {
            Float maxBid = auction.getBids().stream()
                .map(bid -> bid.getAmount())
                .max(Float::compare)
                .orElse(0f);
            dto.setCurrentPrice(maxBid);
        } else {
            dto.setCurrentPrice(0f);
        }
        
        return dto;
    }
    
    public Page<PublicAuctionResponseDTO> findPublicAuctions(
            String status,
            Long categoryId,
            String search,
            Pageable pageable) {
        
        AuctionStatus auctionStatus = null;
        if (status != null && !status.trim().isEmpty()) {
            try {
                auctionStatus = AuctionStatus.valueOf(status.toUpperCase());
            } catch (IllegalArgumentException e) {
                auctionStatus = AuctionStatus.OPEN;
            }
        }
        
        return auctionRepository.findByFilters(
                auctionStatus,
                categoryId,
                null,
                null,
                search,
                pageable
        ).map(this::toPublicResponseDTO);
    }
    
    public List<PublicAuctionResponseDTO> findEndingSoonAuctions(int limit) {
        LocalDateTime now = LocalDateTime.now();
        LocalDateTime maxEndTime = now.plusHours(24);
        
        List<Auction> auctions = auctionRepository.findEndingSoon(
                AuctionStatus.OPEN,
                now,
                maxEndTime,
                PageRequest.of(0, limit)
        );
        
        return auctions.stream()
                .map(this::toPublicResponseDTO)
                .collect(Collectors.toList());
    }
    
    public List<PublicAuctionResponseDTO> findMostPopularAuctions(int limit) {
        List<Auction> auctions = auctionRepository.findMostPopular(
                AuctionStatus.OPEN,
                PageRequest.of(0, limit)
        );
        
        return auctions.stream()
                .map(this::toPublicResponseDTO)
                .collect(Collectors.toList());
    }
    
    private PublicAuctionResponseDTO toPublicResponseDTO(Auction auction) {
        PublicAuctionResponseDTO dto = new PublicAuctionResponseDTO();
        dto.setId(auction.getId());
        dto.setTitle(auction.getTitle());
        dto.setDescription(auction.getDescription());
        dto.setStartDateTime(auction.getStartDateTime());
        dto.setEndDateTime(auction.getEndDateTime());
        dto.setStatus(auction.getStatus());
        
        if (auction.getCategory() != null) {
            dto.setCategoryId(auction.getCategory().getId());
            dto.setCategoryName(auction.getCategory().getName());
        }
        
        Float currentPrice = auction.getMinimumBid();
        if (auction.getBids() != null && !auction.getBids().isEmpty()) {
            currentPrice = auction.getBids().stream()
                    .map(bid -> bid.getAmount())
                    .max(Comparator.naturalOrder())
                    .orElse(auction.getMinimumBid());
        }
        dto.setCurrentPrice(currentPrice);
        
        if (auction.getImages() != null && !auction.getImages().isEmpty()) {
            auction.getImages().stream()
                    .min((img1, img2) -> {
                        if (img1.getDisplayOrder() != null && img2.getDisplayOrder() != null) {
                            return img1.getDisplayOrder().compareTo(img2.getDisplayOrder());
                        }
                        if (img1.getUploadedAt() == null) return 1;
                        if (img2.getUploadedAt() == null) return -1;
                        return img1.getUploadedAt().compareTo(img2.getUploadedAt());
                    })
                    .ifPresent(image -> {
                        dto.setMainImageId(image.getId());
                        dto.setImageUrl(image.getImageName());
                    });
        }
        
        dto.setTotalBids(auction.getBids() != null ? auction.getBids().size() : 0);
        
        return dto;
    }
    
    public AuctionDetailDTO getPublicAuctionDetail(Long id) {
        Auction auction = findById(id);
        
        AuctionDetailDTO dto = new AuctionDetailDTO();
        dto.setId(auction.getId());
        dto.setTitle(auction.getTitle());
        dto.setDescription(auction.getDescription());
        dto.setStartDateTime(auction.getStartDateTime());
        dto.setEndDateTime(auction.getEndDateTime());
        dto.setStatus(auction.getStatus());
        dto.setMinimumBid(auction.getMinimumBid());
        
        if (auction.getCategory() != null) {
            dto.setCategoryId(auction.getCategory().getId());
            dto.setCategoryName(auction.getCategory().getName());
        }
        
        Float currentPrice = auction.getMinimumBid();
        if (auction.getBids() != null && !auction.getBids().isEmpty()) {
            currentPrice = auction.getBids().stream()
                    .map(Bid::getAmount)
                    .max(Comparator.naturalOrder())
                    .orElse(auction.getMinimumBid());
        }
        dto.setCurrentPrice(currentPrice);
        dto.setTotalBids(auction.getBids() != null ? auction.getBids().size() : 0);
        
        Boolean currentUserHasBids = false;
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication != null && authentication.isAuthenticated() && 
            !"anonymousUser".equals(authentication.getPrincipal())) {
            String email = authentication.getName();
            Person currentUser = personRepository.findByEmail(email).orElse(null);
            
            if (currentUser != null && auction.getBids() != null) {
                currentUserHasBids = auction.getBids().stream()
                    .anyMatch(bid -> bid.getBidder() != null && 
                                   bid.getBidder().getId().equals(currentUser.getId()));
            }
        }
        dto.setCurrentUserHasBids(currentUserHasBids);
        
        if (auction.getImages() != null && !auction.getImages().isEmpty()) {
            List<AuctionDetailDTO.ImageDTO> imageDTOs = auction.getImages().stream()
                    .sorted((a, b) -> {
                        if (a.getDisplayOrder() == null) return 1;
                        if (b.getDisplayOrder() == null) return -1;
                        return a.getDisplayOrder().compareTo(b.getDisplayOrder());
                    })
                    .map(img -> new AuctionDetailDTO.ImageDTO(
                            img.getId(),
                            img.getImageName(),
                            img.getDisplayOrder(),
                            img.getUploadedAt()
                    ))
                    .collect(Collectors.toList());
            dto.setImages(imageDTOs);
        }
        
        List<Bid> recentBids = bidRepository.findRecentBidsByAuctionId(
                auction.getId(),
                PageRequest.of(0, 10)
        );
        
        if (recentBids != null && !recentBids.isEmpty()) {
            List<AuctionDetailDTO.RecentBidDTO> bidDTOs = recentBids.stream()
                    .map(bid -> new AuctionDetailDTO.RecentBidDTO(
                            bid.getId(),
                            bid.getAmount(),
                            bid.getBidDateTime(),
                            bid.getBidder().getName()
                    ))
                    .collect(Collectors.toList());
            dto.setRecentBids(bidDTOs);
        }
        
        if (auction.getPublisher() != null) {
            Person seller = auction.getPublisher();
            
            Page<Feedback> sellerFeedbacks = feedbackRepository.findByRecipientId(
                    seller.getId(),
                    PageRequest.of(0, 1000)
            );
            
            Double averageRating = null;
            Integer totalFeedbacks = 0;
            
            if (sellerFeedbacks != null && sellerFeedbacks.hasContent()) {
                List<Feedback> feedbackList = sellerFeedbacks.getContent();
                totalFeedbacks = feedbackList.size();
                
                averageRating = feedbackList.stream()
                        .mapToInt(Feedback::getRating)
                        .average()
                        .orElse(0.0);
            }
            
            AuctionDetailDTO.SellerInfoDTO sellerDTO = new AuctionDetailDTO.SellerInfoDTO(
                    seller.getId(),
                    seller.getName(),
                    seller.getEmail(),
                    averageRating,
                    totalFeedbacks
            );
            dto.setSeller(sellerDTO);
        }
        
        return dto;
    }
    
    public Page<AuctionResponseDTO> getAuctionsWithMyBids(
            String status, Long categoryId, String search, Pageable pageable) {
        
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()) {
            throw new NotFoundException("User not authenticated");
        }
        
        String email = authentication.getName();
        Person currentUser = personRepository.findByEmail(email)
                .orElseThrow(() -> new NotFoundException("User not found"));
        
        List<Bid> userBids = bidRepository.findByBidderId(currentUser.getId());
        List<Long> auctionIds = userBids.stream()
                .map(bid -> bid.getAuction().getId())
                .distinct()
                .collect(Collectors.toList());
        
        if (auctionIds.isEmpty()) {
            return Page.empty(pageable);
        }
        
        AuctionStatus auctionStatus = null;
        if (status != null && !status.trim().isEmpty()) {
            try {
                auctionStatus = AuctionStatus.valueOf(status.toUpperCase());
            } catch (IllegalArgumentException e) {
            }
        }
        
        Page<Auction> auctions = auctionRepository.findByIdInAndFilters(
                auctionIds, auctionStatus, categoryId, search, pageable);
        
        return auctions.map(this::toResponseDTO);
    }
}
