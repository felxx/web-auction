package com.github.felxx.backend.repository;

import com.github.felxx.backend.model.Bid;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface BidRepository extends JpaRepository<Bid, Long> {
    
    Page<Bid> findByAuctionId(Long auctionId, Pageable pageable);
    
    @Query("SELECT b FROM Bid b WHERE b.auction.id = :auctionId ORDER BY b.amount DESC")
    List<Bid> findByAuctionIdOrderByAmountDesc(@Param("auctionId") Long auctionId);
    
    @Query("SELECT b FROM Bid b WHERE b.auction.id = :auctionId ORDER BY b.bidDateTime DESC")
    List<Bid> findRecentBidsByAuctionId(@Param("auctionId") Long auctionId, Pageable pageable);
}

