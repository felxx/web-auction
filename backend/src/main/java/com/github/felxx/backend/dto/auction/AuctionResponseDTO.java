package com.github.felxx.backend.dto.auction;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AuctionResponseDTO {
    
    private Long id;
    private String title;
    private String description;
    private String detailedDescription;
    private LocalDateTime startDateTime;
    private LocalDateTime endDateTime;
    private String status;
    private String notes;
    private Float incrementValue;
    private Float minimumBid;
    private Long categoryId;
    private String categoryName;
    private Long publisherId;
    private String publisherName;
    private Integer totalBids;
    private Long mainImageId;
    private Float currentPrice;
}
