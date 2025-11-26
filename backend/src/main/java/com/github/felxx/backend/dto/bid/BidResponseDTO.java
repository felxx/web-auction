package com.github.felxx.backend.dto.bid;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class BidResponseDTO {
    
    private Long id;
    private Float amount;
    private LocalDateTime bidDateTime;
    private Long auctionId;
    private String auctionTitle;
    private Long bidderId;
    private String bidderName;
}
