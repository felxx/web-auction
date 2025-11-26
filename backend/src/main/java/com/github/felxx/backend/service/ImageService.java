package com.github.felxx.backend.service;

import com.github.felxx.backend.exception.NotFoundException;
import com.github.felxx.backend.model.Image;
import com.github.felxx.backend.repository.ImageRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class ImageService {

    private final ImageRepository imageRepository;

    @Transactional
    public Image insert(Image image) {
        if (image.getUploadedAt() == null) {
            image.setUploadedAt(LocalDateTime.now());
        }
        return imageRepository.save(image);
    }

    @Transactional
    public Image update(Long id, Image image) {
        Image existingImage = findById(id);
        existingImage.setImageName(image.getImageName());
        existingImage.setAuction(image.getAuction());
        return imageRepository.save(existingImage);
    }

    @Transactional
    public void delete(Long id) {
        Image image = findById(id);
        imageRepository.delete(image);
    }

    public Image findById(Long id) {
        return imageRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Image not found with id: " + id));
    }

    public Page<Image> findAll(Pageable pageable) {
        return imageRepository.findAll(pageable);
    }

    public Page<Image> findByAuction(Long auctionId, Pageable pageable) {
        return imageRepository.findByAuctionId(auctionId, pageable);
    }
}
