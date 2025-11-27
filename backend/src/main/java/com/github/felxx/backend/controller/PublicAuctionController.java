package com.github.felxx.backend.controller;

import com.github.felxx.backend.dto.auction.AuctionDetailDTO;
import com.github.felxx.backend.dto.auction.PublicAuctionResponseDTO;
import com.github.felxx.backend.service.AuctionService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/public/auctions")
@RequiredArgsConstructor
public class PublicAuctionController {

    private final AuctionService auctionService;

    @GetMapping
    public ResponseEntity<Page<PublicAuctionResponseDTO>> findPublicAuctions(
            @RequestParam(required = false) String status,
            @RequestParam(required = false) Long categoryId,
            @RequestParam(required = false) String search,
            @PageableDefault(size = 12, sort = "endDateTime", direction = Sort.Direction.ASC) Pageable pageable) {
        
        Page<PublicAuctionResponseDTO> auctions = auctionService.findPublicAuctions(
                status,
                categoryId,
                search,
                pageable
        );
        
        return ResponseEntity.ok(auctions);
    }
    
    @GetMapping("/ending-soon")
    public ResponseEntity<List<PublicAuctionResponseDTO>> findEndingSoonAuctions(
            @RequestParam(defaultValue = "3") int limit) {
        List<PublicAuctionResponseDTO> auctions = auctionService.findEndingSoonAuctions(limit);
        return ResponseEntity.ok(auctions);
    }
    
    @GetMapping("/most-popular")
    public ResponseEntity<List<PublicAuctionResponseDTO>> findMostPopularAuctions(
            @RequestParam(defaultValue = "3") int limit) {
        List<PublicAuctionResponseDTO> auctions = auctionService.findMostPopularAuctions(limit);
        return ResponseEntity.ok(auctions);
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<AuctionDetailDTO> getAuctionDetail(@PathVariable("id") Long id) {
        AuctionDetailDTO auctionDetail = auctionService.getPublicAuctionDetail(id);
        return ResponseEntity.ok(auctionDetail);
    }
}
