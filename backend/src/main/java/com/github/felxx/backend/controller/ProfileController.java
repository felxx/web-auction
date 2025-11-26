package com.github.felxx.backend.controller;

import com.github.felxx.backend.dto.profile.ProfileRequestDTO;
import com.github.felxx.backend.dto.profile.ProfileResponseDTO;
import com.github.felxx.backend.model.Profile;
import com.github.felxx.backend.model.ProfileType;
import com.github.felxx.backend.service.ProfileService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/profiles")
@RequiredArgsConstructor
public class ProfileController {

    private final ProfileService profileService;

    @PostMapping
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<ProfileResponseDTO> insert(@Valid @RequestBody ProfileRequestDTO requestDTO) {
        ProfileResponseDTO response = profileService.insert(requestDTO);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<ProfileResponseDTO> update(@PathVariable("id") Long id, @Valid @RequestBody ProfileRequestDTO requestDTO) {
        ProfileResponseDTO response = profileService.update(id, requestDTO);
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<Void> delete(@PathVariable("id") Long id) {
        profileService.delete(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Profile> findById(@PathVariable("id") Long id) {
        return ResponseEntity.ok(profileService.findById(id));
    }

    @GetMapping
    public ResponseEntity<Page<ProfileResponseDTO>> findAll(Pageable pageable) {
        return ResponseEntity.ok(profileService.findAll(pageable));
    }

    @GetMapping("/type/{type}")
    public ResponseEntity<Profile> findByType(@PathVariable("type") ProfileType type) {
        return ResponseEntity.ok(profileService.findByType(type));
    }
}
