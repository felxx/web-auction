package com.github.felxx.backend.repository;

import com.github.felxx.backend.model.Feedback;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface FeedbackRepository extends JpaRepository<Feedback, Long> {
    Page<Feedback> findByRecipientId(Long recipientId, Pageable pageable);
    Page<Feedback> findByWriterId(Long writerId, Pageable pageable);
}
