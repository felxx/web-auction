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

import java.time.LocalDateTime;

@RequiredArgsConstructor
@RestController
@RequestMapping("/auctions")
public class AuctionController {
    
    private final AuctionService auctionService;

    @PostMapping
    public ResponseEntity<AuctionResponseDTO> insert(@Valid @RequestBody AuctionRequestDTO auctionDTO) {
        AuctionResponseDTO created = auctionService.insert(auctionDTO);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    @PutMapping("/{id}")
    public ResponseEntity<AuctionResponseDTO> update(
            @PathVariable("id") Long id, 
            @Valid @RequestBody AuctionRequestDTO auctionDTO) {
        AuctionResponseDTO updated = auctionService.update(id, auctionDTO);
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable("id") Long id) {
        auctionService.delete(id);
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
        
        Page<AuctionResponseDTO> auctions = auctionService.findByFilters(
                status, categoryId, startDate, endDate, search, pageable);
        return ResponseEntity.ok(auctions);
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<AuctionResponseDTO> findById(@PathVariable("id") Long id) {
        AuctionResponseDTO auction = auctionService.findByIdDTO(id);
        return ResponseEntity.ok(auction);
    }
}
