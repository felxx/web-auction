package com.github.felxx.backend.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.github.felxx.backend.model.Auction;
import com.github.felxx.backend.model.AuctionStatus;

import java.time.LocalDateTime;
import java.util.List;

public interface AuctionRepository extends JpaRepository<Auction, Long> {
    
    List<Auction> findAllByStatusAndEndDateTimeBefore(AuctionStatus status, LocalDateTime dateTime);

    List<Auction> findAllByStatusAndStartDateTimeBefore(AuctionStatus status, LocalDateTime dateTime);

    Page<Auction> findByStatus(AuctionStatus status, Pageable pageable);
    
    @Query("SELECT a FROM Auction a " +
           "LEFT JOIN a.category c " +
           "WHERE (:status IS NULL OR a.status = :status) AND " +
           "(:categoryId IS NULL OR c.id = :categoryId) AND " +
           "(:startDate IS NULL OR a.startDateTime >= :startDate) AND " +
           "(:endDate IS NULL OR a.endDateTime <= :endDate) AND " +
           "(:search IS NULL OR :search = '' OR LOWER(a.title) LIKE LOWER(CONCAT('%', :search, '%')) OR LOWER(a.description) LIKE LOWER(CONCAT('%', :search, '%')))")
    Page<Auction> findByFilters(
        @Param("status") AuctionStatus status,
        @Param("categoryId") Long categoryId,
        @Param("startDate") LocalDateTime startDate,
        @Param("endDate") LocalDateTime endDate,
        @Param("search") String search,
        Pageable pageable
    );
    
    List<Auction> findByStatus(AuctionStatus status);
    
    @Query("SELECT a FROM Auction a " +
           "WHERE a.status = :status " +
           "AND a.endDateTime > :now " +
           "AND a.endDateTime <= :maxEndTime " +
           "ORDER BY a.endDateTime ASC")
    List<Auction> findEndingSoon(
        @Param("status") AuctionStatus status,
        @Param("now") LocalDateTime now,
        @Param("maxEndTime") LocalDateTime maxEndTime,
        Pageable pageable
    );
    
    @Query("SELECT a FROM Auction a " +
           "LEFT JOIN a.bids b " +
           "WHERE a.status = :status " +
           "GROUP BY a.id " +
           "HAVING COUNT(b.id) > 0 " +
           "ORDER BY COUNT(b.id) DESC")
    List<Auction> findMostPopular(
        @Param("status") AuctionStatus status,
        Pageable pageable
    );
    
    @Query("SELECT a FROM Auction a " +
           "LEFT JOIN a.category c " +
           "WHERE a.id IN :auctionIds AND " +
           "(:status IS NULL OR a.status = :status) AND " +
           "(:categoryId IS NULL OR c.id = :categoryId) AND " +
           "(:search IS NULL OR :search = '' OR LOWER(a.title) LIKE LOWER(CONCAT('%', :search, '%')) OR LOWER(a.description) LIKE LOWER(CONCAT('%', :search, '%')))")
    Page<Auction> findByIdInAndFilters(
        @Param("auctionIds") List<Long> auctionIds,
        @Param("status") AuctionStatus status,
        @Param("categoryId") Long categoryId,
        @Param("search") String search,
        Pageable pageable
    );
}


