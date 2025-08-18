package com.github.felxx.backend.repository;

import com.github.felxx.backend.model.Profile;
import com.github.felxx.backend.model.ProfileType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ProfileRepository extends JpaRepository<Profile, Long> {
    Optional<Profile> findByType(ProfileType type);
}