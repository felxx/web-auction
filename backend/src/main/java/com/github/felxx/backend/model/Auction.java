package com.github.felxx.backend.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

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

    @NotBlank(message = "Title cannot be blank")
    private String title;
    
    @NotBlank(message = "Description cannot be blank")
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
    @JoinColumn(name = "publisher_id")
    private Person publisher;

    @ManyToOne
    @JoinColumn(name = "category_id", nullable = false)
    @NotNull(message = "Category cannot be null")
    private Category category;

    @OneToMany(mappedBy = "auction", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonIgnoreProperties("auction")
    private List<Image> images;

    @OneToMany(mappedBy = "auction")
    @JsonIgnoreProperties("auction")
    private List<Bid> bids;

    @OneToOne(mappedBy = "auction", cascade = CascadeType.ALL)
    @JsonIgnoreProperties("auction")
    private Payment payment;
}