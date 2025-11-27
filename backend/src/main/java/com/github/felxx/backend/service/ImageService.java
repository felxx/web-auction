package com.github.felxx.backend.service;

import com.github.felxx.backend.exception.BusinessException;
import com.github.felxx.backend.exception.NotFoundException;
import com.github.felxx.backend.model.Auction;
import com.github.felxx.backend.model.Image;
import com.github.felxx.backend.repository.AuctionRepository;
import com.github.felxx.backend.repository.ImageRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ImageService {

    private final ImageRepository imageRepository;
    private final AuctionRepository auctionRepository;
    
    private static final long MAX_FILE_SIZE = 5 * 1024 * 1024;
    private static final int MAX_IMAGES_PER_AUCTION = 5;
    private static final List<String> ALLOWED_CONTENT_TYPES = List.of(
        "image/jpeg", "image/jpg", "image/png", "image/gif", "image/webp"
    );

    @Transactional
    public List<Image> uploadImages(Long auctionId, MultipartFile[] files) {
        if (files == null || files.length == 0) {
            throw new BusinessException("No files provided");
        }
        
        if (files.length > MAX_IMAGES_PER_AUCTION) {
            throw new BusinessException("Maximum " + MAX_IMAGES_PER_AUCTION + " images allowed");
        }
        
        Auction auction = auctionRepository.findById(auctionId)
                .orElseThrow(() -> new NotFoundException("Auction not found with id: " + auctionId));
        
        List<Image> images = new ArrayList<>();
        
        for (int i = 0; i < files.length; i++) {
            MultipartFile file = files[i];
            
            if (file.isEmpty()) {
                continue;
            }
            
            if (file.getSize() > MAX_FILE_SIZE) {
                throw new BusinessException("File " + file.getOriginalFilename() + " exceeds maximum size of 10MB");
            }
            
            String contentType = file.getContentType();
            if (!ALLOWED_CONTENT_TYPES.contains(contentType)) {
                throw new BusinessException("File " + file.getOriginalFilename() + " has invalid type. Allowed: JPEG, PNG, WEBP");
            }
            
            try {
                Image image = new Image();
                image.setImageName(file.getOriginalFilename());
                image.setImageData(file.getBytes());
                image.setContentType(contentType);
                image.setFileSize(file.getSize());
                image.setDisplayOrder(i);
                image.setUploadedAt(LocalDateTime.now());
                image.setAuction(auction);
                
                images.add(imageRepository.save(image));
            } catch (IOException e) {
                throw new BusinessException("Failed to process file: " + file.getOriginalFilename());
            }
        }
        
        return images;
    }

    public Image findById(Long id) {
        return imageRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Image not found with id: " + id));
    }
}
