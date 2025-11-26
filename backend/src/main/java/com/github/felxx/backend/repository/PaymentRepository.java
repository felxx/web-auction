package com.github.felxx.backend.repository;

import com.github.felxx.backend.model.Payment;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface PaymentRepository extends JpaRepository<Payment, Long> {
    Optional<Payment> findByAuctionId(Long auctionId);
    Page<Payment> findByStatus(String status, Pageable pageable);
}
