package com.github.felxx.backend.controller;

import com.github.felxx.backend.model.Image;
import com.github.felxx.backend.service.ImageService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/images")
@RequiredArgsConstructor
public class ImageController {

    private final ImageService imageService;

    @PostMapping("/auction/{auctionId}")
    public ResponseEntity<List<Image>> uploadImages(
            @PathVariable("auctionId") Long auctionId,
            @RequestParam("files") MultipartFile[] files) {
        List<Image> images = imageService.uploadImages(auctionId, files);
        return ResponseEntity.status(HttpStatus.CREATED).body(images);
    }

    @GetMapping("/{id}/data")
    public ResponseEntity<byte[]> getImageData(@PathVariable("id") Long id) {
        Image image = imageService.findById(id);
        
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.parseMediaType(image.getContentType()));
        headers.setContentLength(image.getFileSize());
        headers.setCacheControl("no-cache, no-store, must-revalidate");
        headers.setPragma("no-cache");
        headers.setExpires(0);
        
        return ResponseEntity.ok()
                .headers(headers)
                .body(image.getImageData());
    }
}
