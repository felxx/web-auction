package com.github.felxx.backend.repository;

import com.github.felxx.backend.model.Feedback;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface FeedbackRepository extends JpaRepository<Feedback, Long> {
    Page<Feedback> findByRecipientId(Long recipientId, Pageable pageable);
    Page<Feedback> findByWriterId(Long writerId, Pageable pageable);
    
    @Query("SELECT AVG(f.rating) FROM Feedback f WHERE f.recipient.id = :recipientId")
    Double getAverageRatingByRecipientId(@Param("recipientId") Long recipientId);
    
    @Query("SELECT COUNT(f) FROM Feedback f WHERE f.recipient.id = :recipientId")
    Long countByRecipientId(@Param("recipientId") Long recipientId);

    @Query("SELECT COUNT(f) > 0 FROM Feedback f WHERE f.writer.id = :writerId AND f.auctionId = :auctionId")
    boolean existsByWriterIdAndAuctionId(@Param("writerId") Long writerId, @Param("auctionId") Long auctionId);
}