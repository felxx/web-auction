package com.github.felxx.backend.service;

import com.github.felxx.backend.exception.NotFoundException;
import com.github.felxx.backend.model.Bid;
import com.github.felxx.backend.repository.BidRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.BeanUtils;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class BidService {

    private final BidRepository bidRepository;

    public Bid insert(Bid bid) {
        bid.setBidDateTime(LocalDateTime.now());
        return bidRepository.save(bid);
    }

    public Bid update(Long id, Bid bid) {
        Bid existingBid = findById(id);
        BeanUtils.copyProperties(bid, existingBid, "id", "date");
        return bidRepository.save(existingBid);
    }

    public void delete(Long id) {
        Bid bid = findById(id);
        bidRepository.delete(bid);
    }

    public Bid findById(Long id) {
        return bidRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Bid not found!"));
    }

    public Page<Bid> findAll(Pageable pageable) {
        return bidRepository.findAll(pageable);
    }
}