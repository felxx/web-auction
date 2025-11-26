package com.github.felxx.backend.controller;

import com.github.felxx.backend.model.Image;
import com.github.felxx.backend.service.ImageService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/images")
@RequiredArgsConstructor
public class ImageController {

    private final ImageService imageService;

    @PostMapping
    public ResponseEntity<Image> insert(@Valid @RequestBody Image image) {
        return ResponseEntity.ok(imageService.insert(image));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Image> update(@PathVariable("id") Long id, @Valid @RequestBody Image image) {
        return ResponseEntity.ok(imageService.update(id, image));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable("id") Long id) {
        imageService.delete(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Image> findById(@PathVariable("id") Long id) {
        return ResponseEntity.ok(imageService.findById(id));
    }

    @GetMapping
    public ResponseEntity<Page<Image>> findAll(Pageable pageable) {
        return ResponseEntity.ok(imageService.findAll(pageable));
    }

    @GetMapping("/auction/{auctionId}")
    public ResponseEntity<Page<Image>> findByAuction(@PathVariable("auctionId") Long auctionId, Pageable pageable) {
        return ResponseEntity.ok(imageService.findByAuction(auctionId, pageable));
    }
}
