package com.github.felxx.backend.dto.websocket;

import com.github.felxx.backend.model.AuctionStatus;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AuctionStatusUpdateDTO {
    private Long auctionId;
    private AuctionStatus status;
    private LocalDateTime timestamp;
}
