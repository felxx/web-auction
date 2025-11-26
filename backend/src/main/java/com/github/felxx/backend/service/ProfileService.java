package com.github.felxx.backend.service;

import com.github.felxx.backend.dto.profile.ProfileRequestDTO;
import com.github.felxx.backend.dto.profile.ProfileResponseDTO;
import com.github.felxx.backend.exception.BusinessException;
import com.github.felxx.backend.exception.NotFoundException;
import com.github.felxx.backend.model.Profile;
import com.github.felxx.backend.model.ProfileType;
import com.github.felxx.backend.repository.ProfileRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class ProfileService {

    private final ProfileRepository profileRepository;

    @Transactional
    public ProfileResponseDTO insert(ProfileRequestDTO requestDTO) {
        ProfileType type = requestDTO.getType();
        
        if (profileRepository.findByType(type).isPresent()) {
            throw new BusinessException("Profile already exists: " + type);
        }
        
        Profile profile = new Profile();
        profile.setType(type);
        Profile savedProfile = profileRepository.save(profile);
        
        return toResponseDTO(savedProfile);
    }

    @Transactional
    public ProfileResponseDTO update(Long id, ProfileRequestDTO requestDTO) {
        Profile existingProfile = findById(id);
        ProfileType newType = requestDTO.getType();
        
        profileRepository.findByType(newType).ifPresent(p -> {
            if (!p.getId().equals(id)) {
                throw new BusinessException("Profile already exists: " + newType);
            }
        });
        
        existingProfile.setType(newType);
        Profile savedProfile = profileRepository.save(existingProfile);
        
        return toResponseDTO(savedProfile);
    }

    @Transactional
    public void delete(Long id) {
        Profile profile = findById(id);
        profileRepository.delete(profile);
    }

    public Profile findById(Long id) {
        return profileRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Profile not found with id: " + id));
    }

    public Page<ProfileResponseDTO> findAll(Pageable pageable) {
        return profileRepository.findAll(pageable).map(this::toResponseDTO);
    }

    public Profile findByType(ProfileType type) {
        return profileRepository.findByType(type)
                .orElseThrow(() -> new NotFoundException("Profile not found with type: " + type));
    }
    
    public ProfileResponseDTO toResponseDTO(Profile profile) {
        ProfileResponseDTO dto = new ProfileResponseDTO();
        dto.setId(profile.getId().longValue());
        dto.setType(profile.getType().name());
        return dto;
    }
}
