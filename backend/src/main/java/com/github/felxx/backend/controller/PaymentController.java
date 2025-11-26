package com.github.felxx.backend.controller;

import com.github.felxx.backend.model.Payment;
import com.github.felxx.backend.service.PaymentService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/payments")
@RequiredArgsConstructor
public class PaymentController {

    private final PaymentService paymentService;

    @PostMapping
    public ResponseEntity<Payment> insert(@Valid @RequestBody Payment payment) {
        return ResponseEntity.ok(paymentService.insert(payment));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Payment> update(@PathVariable("id") Long id, @Valid @RequestBody Payment payment) {
        return ResponseEntity.ok(paymentService.update(id, payment));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable("id") Long id) {
        paymentService.delete(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Payment> findById(@PathVariable("id") Long id) {
        return ResponseEntity.ok(paymentService.findById(id));
    }

    @GetMapping
    public ResponseEntity<Page<Payment>> findAll(Pageable pageable) {
        return ResponseEntity.ok(paymentService.findAll(pageable));
    }

    @GetMapping("/auction/{auctionId}")
    public ResponseEntity<Payment> findByAuction(@PathVariable("auctionId") Long auctionId) {
        return ResponseEntity.ok(paymentService.findByAuction(auctionId));
    }

    @GetMapping("/status/{status}")
    public ResponseEntity<Page<Payment>> findByStatus(@PathVariable("status") String status, Pageable pageable) {
        return ResponseEntity.ok(paymentService.findByStatus(status, pageable));
    }
}
