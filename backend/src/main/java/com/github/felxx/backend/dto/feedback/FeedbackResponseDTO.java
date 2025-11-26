package com.github.felxx.backend.dto.feedback;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class FeedbackResponseDTO {
    
    private Long id;
    private String comment;
    private Integer rating;
    private LocalDateTime createdAt;
    private Long writerId;
    private String writerName;
    private Long recipientId;
    private String recipientName;
    private Long auctionId;
    private String auctionTitle;
}
