package com.github.felxx.backend.dto.auction;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AuctionRequestDTO {
    
    @NotBlank(message = "Title cannot be blank")
    private String title;
    
    @NotBlank(message = "Description cannot be blank")
    private String description;
    
    private String detailedDescription;
    
    @NotNull(message = "Start date and time cannot be null")
    private LocalDateTime startDateTime;
    
    @NotNull(message = "End date and time cannot be null")
    private LocalDateTime endDateTime;
    
    
    @Positive(message = "Minimum bid must be positive")
    private Float minimumBid;
    
    @NotNull(message = "Category ID cannot be null")
    private Long categoryId;
}
