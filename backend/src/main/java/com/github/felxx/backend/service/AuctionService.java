package com.github.felxx.backend.service;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import com.github.felxx.backend.exception.NotFoundException;
import com.github.felxx.backend.model.Auction;
import com.github.felxx.backend.model.Category;
import com.github.felxx.backend.repository.AuctionRepository;
import com.github.felxx.backend.repository.CategoryRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class AuctionService {
    
    private final AuctionRepository auctionRepository;
    private final CategoryRepository categoryRepository;

    public Auction insert(Auction auction){
        if (auction.getCategory() != null && auction.getCategory().getId() != null) {
            Category category = categoryRepository.findById(auction.getCategory().getId())
                .orElseThrow(() -> new NotFoundException("Category not found!"));
            auction.setCategory(category);
        }
        return auctionRepository.save(auction);
    }

    public Auction update(Long id, Auction auction){
        Auction existingAuction = auctionRepository.findById(id).orElseThrow(() -> new NotFoundException("Auction not found!"));
        
        if (auction.getCategory() != null && auction.getCategory().getId() != null) {
            Category category = categoryRepository.findById(auction.getCategory().getId())
                .orElseThrow(() -> new NotFoundException("Category not found!"));
            existingAuction.setCategory(category);
        }
        
        if (auction.getTitle() != null) {
            existingAuction.setTitle(auction.getTitle());
        }
        if (auction.getDescription() != null) {
            existingAuction.setDescription(auction.getDescription());
        }
        
        if (auction.getDetailedDescription() != null) {
            existingAuction.setDetailedDescription(auction.getDetailedDescription());
        }
        if (auction.getStartDateTime() != null) {
            existingAuction.setStartDateTime(auction.getStartDateTime());
        }
        if (auction.getEndDateTime() != null) {
            existingAuction.setEndDateTime(auction.getEndDateTime());
        }
        if (auction.getStatus() != null) {
            existingAuction.setStatus(auction.getStatus());
        }
        if (auction.getNotes() != null) {
            existingAuction.setNotes(auction.getNotes());
        }
        if (auction.getIncrementValue() != null) {
            existingAuction.setIncrementValue(auction.getIncrementValue());
        }
        if (auction.getMinimumBid() != null) {
            existingAuction.setMinimumBid(auction.getMinimumBid());
        }
        
    
        return auctionRepository.save(existingAuction);
    }

    public void delete(Long id){
        Auction auction = auctionRepository.findById(id).orElseThrow(() -> new NotFoundException("Auction not found!"));
        auctionRepository.delete(auction);
    }

    public Auction findById(Long id){
        return auctionRepository.findById(id).orElseThrow(() -> new NotFoundException("Auction not found!"));
    }

    public Page<Auction> findAll(Pageable pageable){
        return auctionRepository.findAll(pageable);
    }
}
