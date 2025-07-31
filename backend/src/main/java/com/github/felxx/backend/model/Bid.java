package com.github.felxx.backend.model;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Entity
@Data
@Table(name = "bids")
public class Bid {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Float amount;

    private LocalDateTime bidDateTime;

    @ManyToOne
    @JoinColumn(name = "person_id")
    private Person bidder;
    
    @ManyToOne
    @JoinColumn(name = "auction_id")
    private Auction auction;
}