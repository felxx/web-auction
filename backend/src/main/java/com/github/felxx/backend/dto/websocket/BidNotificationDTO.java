package com.github.felxx.backend.dto.websocket;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class BidNotificationDTO {
    private Long auctionId;
    private Long bidId;
    private Float amount;
    private String bidderName;
    private LocalDateTime bidDateTime;
    private Float currentPrice;
    private Integer totalBids;
}
