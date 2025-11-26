package com.github.felxx.backend.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PastOrPresent;
import jakarta.validation.constraints.Positive;
import lombok.Data;
import java.time.LocalDateTime;

@Entity
@Data
@Table(name = "payments")
public class Payment {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotNull(message = "Amount cannot be null")
    @Positive(message = "Amount must be positive")
    private Float amount;

    @NotNull(message = "Payment date and time cannot be null")
    @PastOrPresent(message = "Payment date cannot be in the future")
    private LocalDateTime paymentDateTime;

    @NotBlank(message = "Status cannot be blank")
    private String status;

    @OneToOne
    @JoinColumn(name = "auction_id")
    @NotNull(message = "Auction cannot be null")
    private Auction auction;
}
