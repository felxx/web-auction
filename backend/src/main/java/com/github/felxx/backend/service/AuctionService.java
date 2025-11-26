package com.github.felxx.backend.service;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.transaction.annotation.Transactional;

import com.github.felxx.backend.dto.auction.AuctionDetailDTO;
import com.github.felxx.backend.dto.auction.AuctionRequestDTO;
import com.github.felxx.backend.dto.auction.AuctionResponseDTO;
import com.github.felxx.backend.dto.auction.PublicAuctionResponseDTO;
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

import java.time.LocalDateTime;
import java.util.Comparator;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class AuctionService {
    
    private final AuctionRepository auctionRepository;
    private final CategoryRepository categoryRepository;
    private final PersonRepository personRepository;
    private final BidRepository bidRepository;
    private final FeedbackRepository feedbackRepository;

    @Scheduled(fixedRate = 60000)
    @Transactional
    public void checkAndCloseExpiredAuctions() {
        List<Auction> expiredAuctions = auctionRepository.findAllByStatusAndEndDateTimeBefore(
                AuctionStatus.OPEN, LocalDateTime.now());

        for (Auction auction : expiredAuctions) {
            auction.setStatus(AuctionStatus.CLOSED);
            auctionRepository.save(auction);
        }
    }

    @Transactional
    public AuctionResponseDTO insert(AuctionRequestDTO requestDTO) {
        Auction auction = new Auction();
        mapDTOToEntity(requestDTO, auction);
        
        // Get authenticated user as publisher
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication != null && authentication.isAuthenticated()) {
            String email = authentication.getName();
            Person publisher = personRepository.findByEmail(email)
                    .orElseThrow(() -> new NotFoundException("User not found"));
            auction.setPublisher(publisher);
        }
        
        Auction savedAuction = auctionRepository.save(auction);
        return toResponseDTO(savedAuction);
    }

    @Transactional
    public AuctionResponseDTO update(Long id, AuctionRequestDTO requestDTO) {
        Auction existingAuction = findById(id);
        mapDTOToEntity(requestDTO, existingAuction);
        Auction updatedAuction = auctionRepository.save(existingAuction);
        return toResponseDTO(updatedAuction);
    }

    @Transactional
    public void delete(Long id) {
        Auction auction = findById(id);
        auctionRepository.delete(auction);
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
                // Ignore invalid status
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
        auction.setDetailedDescription(dto.getDetailedDescription());
        auction.setStartDateTime(dto.getStartDateTime());
        auction.setEndDateTime(dto.getEndDateTime());
        auction.setMinimumBid(dto.getMinimumBid());
        
        // Set default status
        if (auction.getStatus() == null) {
            auction.setStatus(AuctionStatus.OPEN);
        }
        
        // Set category
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
        dto.setDetailedDescription(auction.getDetailedDescription());
        dto.setStartDateTime(auction.getStartDateTime());
        dto.setEndDateTime(auction.getEndDateTime());
        dto.setStatus(auction.getStatus() != null ? auction.getStatus().name() : null);
        dto.setNotes(auction.getNotes());
        dto.setIncrementValue(auction.getIncrementValue());
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
                .filter(img -> img.getDisplayOrder() != null && img.getDisplayOrder() == 0)
                .findFirst()
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
    
    // Public method for listing auctions without authentication
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
                // Default to OPEN if invalid
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
        
        // Calculate current price (highest bid or minimum bid)
        Float currentPrice = auction.getMinimumBid();
        if (auction.getBids() != null && !auction.getBids().isEmpty()) {
            currentPrice = auction.getBids().stream()
                    .map(bid -> bid.getAmount())
                    .max(Comparator.naturalOrder())
                    .orElse(auction.getMinimumBid());
        }
        dto.setCurrentPrice(currentPrice);
        
        // Get first image (main image) if available
        if (auction.getImages() != null && !auction.getImages().isEmpty()) {
            auction.getImages().stream()
                    .filter(image -> image.getDisplayOrder() != null && image.getDisplayOrder() == 0)
                    .findFirst()
                    .ifPresent(image -> {
                        dto.setMainImageId(image.getId());
                        dto.setImageUrl(image.getImageName());
                    });
        }
        
        // Total bids
        dto.setTotalBids(auction.getBids() != null ? auction.getBids().size() : 0);
        
        return dto;
    }
    
    // Public method for getting auction details
    public AuctionDetailDTO getPublicAuctionDetail(Long id) {
        Auction auction = findById(id);
        
        AuctionDetailDTO dto = new AuctionDetailDTO();
        dto.setId(auction.getId());
        dto.setTitle(auction.getTitle());
        dto.setDescription(auction.getDescription());
        dto.setDetailedDescription(auction.getDetailedDescription());
        dto.setStartDateTime(auction.getStartDateTime());
        dto.setEndDateTime(auction.getEndDateTime());
        dto.setStatus(auction.getStatus());
        dto.setMinimumBid(auction.getMinimumBid());
        dto.setIncrementValue(auction.getIncrementValue());
        
        // Category
        if (auction.getCategory() != null) {
            dto.setCategoryId(auction.getCategory().getId());
            dto.setCategoryName(auction.getCategory().getName());
        }
        
        // Calculate current price
        Float currentPrice = auction.getMinimumBid();
        if (auction.getBids() != null && !auction.getBids().isEmpty()) {
            currentPrice = auction.getBids().stream()
                    .map(Bid::getAmount)
                    .max(Comparator.naturalOrder())
                    .orElse(auction.getMinimumBid());
        }
        dto.setCurrentPrice(currentPrice);
        dto.setTotalBids(auction.getBids() != null ? auction.getBids().size() : 0);
        
        // Images
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
        
        // Recent bids (last 10)
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
        
        // Seller info with feedback
        if (auction.getPublisher() != null) {
            Person seller = auction.getPublisher();
            
            // Calculate average rating and total feedbacks
            Page<Feedback> sellerFeedbacks = feedbackRepository.findByRecipientId(
                    seller.getId(),
                    PageRequest.of(0, 1000) // Get all feedbacks for calculation
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
                    averageRating,
                    totalFeedbacks
            );
            dto.setSeller(sellerDTO);
        }
        
        return dto;
    }
}
