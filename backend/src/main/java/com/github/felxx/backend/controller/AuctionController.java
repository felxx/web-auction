package com.github.felxx.backend.controller;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import jakarta.validation.Valid;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.github.felxx.backend.dto.auction.AuctionRequestDTO;
import com.github.felxx.backend.dto.auction.AuctionResponseDTO;
import com.github.felxx.backend.service.AuctionService;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import java.time.LocalDateTime;

@Slf4j
@RequiredArgsConstructor
@RestController
@RequestMapping("/auctions")
public class AuctionController {
    
    private final AuctionService auctionService;

    @PostMapping
    public ResponseEntity<AuctionResponseDTO> insert(@Valid @RequestBody AuctionRequestDTO auctionDTO) {
        log.info("Creating new auction with title: {}", auctionDTO.getTitle());
        AuctionResponseDTO created = auctionService.insert(auctionDTO);
        log.info("Auction created successfully with ID: {}", created.getId());
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    @PutMapping("/{id}")
    public ResponseEntity<AuctionResponseDTO> update(
            @PathVariable("id") Long id, 
            @Valid @RequestBody AuctionRequestDTO auctionDTO) {
        log.info("Updating auction with ID: {}", id);
        AuctionResponseDTO updated = auctionService.update(id, auctionDTO);
        log.info("Auction updated successfully: {}", id);
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable("id") Long id) {
        log.info("Deleting auction with ID: {}", id);
        auctionService.delete(id);
        log.info("Auction deleted successfully: {}", id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping
    public ResponseEntity<Page<AuctionResponseDTO>> findAll(
            @RequestParam(required = false) String status,
            @RequestParam(required = false) Long categoryId,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime startDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime endDate,
            @RequestParam(required = false) String search,
            Pageable pageable) {
        log.debug("Finding auctions with filters - status: {}, categoryId: {}, search: {}", status, categoryId, search);
        Page<AuctionResponseDTO> auctions = auctionService.findByFilters(
                status, categoryId, startDate, endDate, search, pageable);
        log.debug("Found {} auctions", auctions.getTotalElements());
        return ResponseEntity.ok(auctions);
    }
    
    @GetMapping("/my-bids")
    public ResponseEntity<Page<AuctionResponseDTO>> getMyBids(
            @RequestParam(required = false) String status,
            @RequestParam(required = false) Long categoryId,
            @RequestParam(required = false) String search,
            Pageable pageable) {
        
        Page<AuctionResponseDTO> auctions = auctionService.getAuctionsWithMyBids(
                status, categoryId, search, pageable);
        return ResponseEntity.ok(auctions);
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<AuctionResponseDTO> findById(@PathVariable("id") Long id) {
        log.debug("Finding auction by ID: {}", id);
        AuctionResponseDTO auction = auctionService.findByIdDTO(id);
        return ResponseEntity.ok(auction);
    }
}
