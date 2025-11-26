package com.github.felxx.backend.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PastOrPresent;
import jakarta.validation.constraints.Size;
import lombok.Data;
import java.time.LocalDateTime;

@Entity
@Data
@Table(name = "feedbacks")
public class Feedback {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "Comment cannot be blank")
    @Size(min = 10, max = 1000, message = "Comment must be between 10 and 1000 characters")
    private String comment;

    @NotNull(message = "Rating cannot be null")
    @Min(value = 1, message = "Rating must be at least 1")
    @Max(value = 5, message = "Rating must be at most 5")
    private Integer rating;

    @PastOrPresent(message = "Created date cannot be in the future")
    private LocalDateTime createdAt;

    @ManyToOne
    @JoinColumn(name = "writer_id")
    @NotNull(message = "Writer cannot be null")
    private Person writer;

    @ManyToOne
    @JoinColumn(name = "recipient_id")
    @NotNull(message = "Recipient cannot be null")
    private Person recipient;
}
