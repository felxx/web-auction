package com.github.felxx.backend.dto.auction;

import com.github.felxx.backend.model.AuctionStatus;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PublicAuctionResponseDTO {
    
    private Long id;
    private String title;
    private String description;
    private String categoryName;
    private Long categoryId;
    private LocalDateTime startDateTime;
    private LocalDateTime endDateTime;
    private Float currentPrice;
    private String imageUrl;
    private AuctionStatus status;
    private Integer totalBids;
}
