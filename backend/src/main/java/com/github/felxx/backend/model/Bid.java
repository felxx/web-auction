package com.github.felxx.backend.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PastOrPresent;
import jakarta.validation.constraints.Positive;
import lombok.Getter;
import lombok.Setter;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.time.LocalDateTime;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "bids")
public class Bid {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotNull(message = "Amount cannot be null")
    @Positive(message = "Amount must be positive")
    private Float amount;

    @NotNull(message = "Bid date and time cannot be null")
    @PastOrPresent(message = "Bid date and time cannot be in the future")
    private LocalDateTime bidDateTime;

    @ManyToOne
    @JoinColumn(name = "person_id")
    @NotNull(message = "Bidder cannot be null")
    private Person bidder;
    
    @ManyToOne
    @JoinColumn(name = "auction_id")
    @NotNull(message = "Auction cannot be null")
    private Auction auction;
}