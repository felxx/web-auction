package com.github.felxx.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.github.felxx.backend.model.Auction;

public interface AuctionRepository extends JpaRepository<Auction, Long> {
    
}
