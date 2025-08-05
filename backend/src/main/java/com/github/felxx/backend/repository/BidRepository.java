package com.github.felxx.backend.repository;

import com.github.felxx.backend.model.Bid;
import org.springframework.data.jpa.repository.JpaRepository;

public interface BidRepository extends JpaRepository<Bid, Long> {
}
