package com.github.felxx.backend.dto.auction;

import com.github.felxx.backend.model.AuctionStatus;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AuctionDetailDTO {
    
    private Long id;
    private String title;
    private String description;
    private String categoryName;
    private Long categoryId;
    private LocalDateTime startDateTime;
    private LocalDateTime endDateTime;
    private AuctionStatus status;
    private Float minimumBid;
    private Float currentPrice;
    private Integer totalBids;
    private Boolean currentUserHasBids;
    private List<ImageDTO> images;
    private List<RecentBidDTO> recentBids;
    private SellerInfoDTO seller;
    
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class ImageDTO {
        private Long id;
        private String imageName;
        private Integer displayOrder;
        private LocalDateTime uploadedAt;
    }
    
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class RecentBidDTO {
        private Long id;
        private Float amount;
        private LocalDateTime bidDateTime;
        private String bidderName;
    }
    
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class SellerInfoDTO {
        private Long id;
        private String name;
        private String email;
        private Double averageRating;
        private Integer totalFeedbacks;
    }
}
