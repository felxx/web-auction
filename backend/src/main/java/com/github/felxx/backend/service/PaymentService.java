package com.github.felxx.backend.service;

import com.github.felxx.backend.exception.NotFoundException;
import com.github.felxx.backend.model.Payment;
import com.github.felxx.backend.repository.PaymentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class PaymentService {

    private final PaymentRepository paymentRepository;

    @Transactional
    public Payment insert(Payment payment) {
        if (payment.getPaymentDateTime() == null) {
            payment.setPaymentDateTime(LocalDateTime.now());
        }
        return paymentRepository.save(payment);
    }

    @Transactional
    public Payment update(Long id, Payment payment) {
        Payment existingPayment = findById(id);
        existingPayment.setAmount(payment.getAmount());
        existingPayment.setStatus(payment.getStatus());
        existingPayment.setPaymentDateTime(payment.getPaymentDateTime());
        return paymentRepository.save(existingPayment);
    }

    @Transactional
    public void delete(Long id) {
        Payment payment = findById(id);
        paymentRepository.delete(payment);
    }

    public Payment findById(Long id) {
        return paymentRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Payment not found with id: " + id));
    }

    public Page<Payment> findAll(Pageable pageable) {
        return paymentRepository.findAll(pageable);
    }

    public Payment findByAuction(Long auctionId) {
        return paymentRepository.findByAuctionId(auctionId)
                .orElseThrow(() -> new NotFoundException("Payment not found for auction id: " + auctionId));
    }

    public Page<Payment> findByStatus(String status, Pageable pageable) {
        return paymentRepository.findByStatus(status, pageable);
    }
}
