package com.github.felxx.backend.controller;

import com.github.felxx.backend.dto.feedback.FeedbackRequestDTO;
import com.github.felxx.backend.dto.feedback.FeedbackResponseDTO;
import com.github.felxx.backend.model.Feedback;
import com.github.felxx.backend.service.FeedbackService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/feedbacks")
@RequiredArgsConstructor
public class FeedbackController {

    private final FeedbackService feedbackService;

    @PostMapping
    @PreAuthorize("hasAnyAuthority('BUYER', 'SELLER', 'ADMIN')")
    public ResponseEntity<FeedbackResponseDTO> insert(@Valid @RequestBody FeedbackRequestDTO requestDTO) {
        FeedbackResponseDTO response = feedbackService.insert(requestDTO);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @PutMapping("/{id}")
    public ResponseEntity<FeedbackResponseDTO> update(@PathVariable("id") Long id, @Valid @RequestBody FeedbackRequestDTO requestDTO) {
        FeedbackResponseDTO response = feedbackService.update(id, requestDTO);
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable("id") Long id) {
        feedbackService.delete(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Feedback> findById(@PathVariable("id") Long id) {
        return ResponseEntity.ok(feedbackService.findById(id));
    }

    @GetMapping
    public ResponseEntity<Page<FeedbackResponseDTO>> findAll(
            @RequestParam(required = false) Long recipientId,
            @RequestParam(required = false) Long writerId,
            Pageable pageable) {
        if (recipientId != null) {
            return ResponseEntity.ok(feedbackService.findByRecipient(recipientId, pageable));
        }
        if (writerId != null) {
            return ResponseEntity.ok(feedbackService.findByWriter(writerId, pageable));
        }
        return ResponseEntity.ok(feedbackService.findAll(pageable));
    }
}
