package com.github.felxx.backend.repository;

import com.github.felxx.backend.model.PersonProfile;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PersonProfileRepository extends JpaRepository<PersonProfile, Long> {
    Page<PersonProfile> findByPersonId(Long personId, Pageable pageable);
    Page<PersonProfile> findByProfileId(Integer profileId, Pageable pageable);
}
