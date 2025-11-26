package com.github.felxx.backend.dto.bid;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class BidRequestDTO {
    
    @NotNull(message = "Amount cannot be null")
    @Positive(message = "Amount must be positive")
    private Float amount;
    
    @NotNull(message = "Auction ID cannot be null")
    private Long auctionId;
}
