package com.github.felxx.backend.controller;

import com.github.felxx.backend.model.Bid;
import com.github.felxx.backend.service.BidService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RequiredArgsConstructor
@RestController
@RequestMapping("/bids")
public class BidController {

    private final BidService bidService;

    @PostMapping
    public ResponseEntity<Bid> insert(@Valid @RequestBody Bid bid) {
        return ResponseEntity.ok(bidService.insert(bid));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Bid> update(@PathVariable("id") Long id, @Valid @RequestBody Bid bid) {
        return ResponseEntity.ok(bidService.update(id, bid));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable("id") Long id) {
        bidService.delete(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping
    public ResponseEntity<Page<Bid>> findAll(Pageable pageable) {
        return ResponseEntity.ok(bidService.findAll(pageable));
    }

    @GetMapping("/{id}")
    public ResponseEntity<Bid> findById(@PathVariable("id") Long id) {
        return ResponseEntity.ok(bidService.findById(id));
    }
}