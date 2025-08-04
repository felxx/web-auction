package com.github.felxx.backend.service;

import org.springframework.beans.BeanUtils;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import com.github.felxx.backend.exception.NotFoundException;
import com.github.felxx.backend.model.Auction;
import com.github.felxx.backend.repository.AuctionRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class AuctionService {
    
    private final AuctionRepository auctionRepository;

    public Auction insert(Auction auction){
        return auctionRepository.save(auction);
    }

    public Auction update(Long id, Auction auction){
        Auction existingAuction = auctionRepository.findById(id).orElseThrow(() -> new NotFoundException("Auction not found!"));
        BeanUtils.copyProperties(auction, existingAuction);
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
