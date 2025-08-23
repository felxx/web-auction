package com.github.felxx.backend.controller;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.RequestBody;
import jakarta.validation.Valid;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.github.felxx.backend.model.Auction;
import com.github.felxx.backend.service.AuctionService;

import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
@RestController
@RequestMapping("/auctions")
public class AuctionController {
    
    private final AuctionService auctionService;

    @PostMapping
    public ResponseEntity<Auction> insert(@Valid @RequestBody Auction auction){
        Auction savedAuction = auctionService.insert(auction);
        return ResponseEntity.ok(savedAuction);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Auction> update(@PathVariable("id") Long id, @Valid @RequestBody Auction auction){
        Auction updatedAuction = auctionService.update(id, auction);
        return ResponseEntity.ok(updatedAuction);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable("id") Long id) {
        auctionService.delete(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping
    public ResponseEntity<Page<Auction>> findAll(Pageable pageable) {
        return ResponseEntity.ok(auctionService.findAll(pageable));
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<Auction> findById(@PathVariable("id") Long id){
        Auction auction = auctionService.findById(id);
        return ResponseEntity.ok(auction);
    }
}
