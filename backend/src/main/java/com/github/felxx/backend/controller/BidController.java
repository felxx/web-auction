package com.github.felxx.backend.controller;

import com.github.felxx.backend.dto.bid.BidRequestDTO;
import com.github.felxx.backend.dto.bid.BidResponseDTO;
import com.github.felxx.backend.model.Bid;
import com.github.felxx.backend.service.BidService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RequiredArgsConstructor
@RestController
@RequestMapping("/bids")
public class BidController {

    private final BidService bidService;

    @PostMapping
    @PreAuthorize("hasAnyAuthority('BUYER', 'SELLER', 'ADMIN')")
    public ResponseEntity<BidResponseDTO> insert(@Valid @RequestBody BidRequestDTO requestDTO) {
        BidResponseDTO response = bidService.insert(requestDTO);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable("id") Long id) {
        bidService.delete(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping
    public ResponseEntity<Page<BidResponseDTO>> findAll(
            @RequestParam(required = false) Long auctionId,
            Pageable pageable) {
        if (auctionId != null) {
            return ResponseEntity.ok(bidService.findByAuctionId(auctionId, pageable));
        }
        return ResponseEntity.ok(bidService.findAll(pageable));
    }

    @GetMapping("/{id}")
    public ResponseEntity<Bid> findById(@PathVariable("id") Long id) {
        return ResponseEntity.ok(bidService.findById(id));
    }
}