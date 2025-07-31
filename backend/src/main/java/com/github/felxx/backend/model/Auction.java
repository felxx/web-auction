package com.github.felxx.backend.model;

import jakarta.persistence.*;

import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;

@Data
@Entity
@Table(name = "auctions")
public class Auction {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;
    private String description;

    @Column(columnDefinition = "TEXT")
    private String detailedDescription;

    private LocalDateTime startDateTime;
    private LocalDateTime endDateTime;

    @Enumerated(EnumType.STRING)
    private AuctionStatus status;

    private String notes;
    private Float incrementValue;
    private Float minimumBid;

    @ManyToOne
    @JoinColumn(name = "seller_id", nullable = false)
    private Person seller;

    @ManyToOne
    @JoinColumn(name = "category_id", nullable = false)
    private Category category;

    @OneToMany(mappedBy = "auction", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Image> images;

    @OneToMany(mappedBy = "auction")
    private List<Bid> bids;

    @OneToOne(mappedBy = "auction", cascade = CascadeType.ALL)
    private Payment payment;
}