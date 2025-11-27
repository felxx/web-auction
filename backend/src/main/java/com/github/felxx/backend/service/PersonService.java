package com.github.felxx.backend.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.thymeleaf.context.Context;

import com.github.felxx.backend.dto.person.PersonRequestDTO;
import com.github.felxx.backend.dto.person.PersonResponseDTO;
import com.github.felxx.backend.dto.person.PersonUpdateDTO;
import com.github.felxx.backend.exception.BusinessException;
import com.github.felxx.backend.exception.NotFoundException;
import com.github.felxx.backend.model.Person;
import com.github.felxx.backend.model.PersonProfile;
import com.github.felxx.backend.model.Profile;
import com.github.felxx.backend.model.ProfileType;
import com.github.felxx.backend.repository.PersonRepository;
import com.github.felxx.backend.repository.ProfileRepository;
import com.github.felxx.backend.repository.FeedbackRepository;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class PersonService {
    @Autowired
    private PersonRepository personRepository;

    @Autowired
    private ProfileRepository profileRepository;

    @Autowired
    private EmailService emailService;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private FeedbackRepository feedbackRepository;

    private void sendSuccessEmail(Person person) {
        try {
            Context context = new Context();
            context.setVariable("name", person.getName());
            emailService.sendTemplateMail(person.getEmail(), "Successfully registration!", context, "successRegister");
        } catch (Exception e) {
            System.err.println("Failed to send email: " + e.getMessage());
        }
    }

    @Transactional
    public PersonResponseDTO insert(PersonRequestDTO requestDTO) {
        if (personRepository.existsByEmail(requestDTO.getEmail())) {
            throw new BusinessException("Email already exists: " + requestDTO.getEmail());
        }

        Person person = new Person();
        person.setName(requestDTO.getName());
        person.setEmail(requestDTO.getEmail());
        person.setPassword(passwordEncoder.encode(requestDTO.getPassword()));

        ProfileType requestedType = ProfileType.BUYER;
        if (requestDTO.getProfileType() != null && !requestDTO.getProfileType().trim().isEmpty()) {
            try {
                requestedType = ProfileType.valueOf(requestDTO.getProfileType().toUpperCase());
            } catch (IllegalArgumentException e) {
            }
        }
        
        final ProfileType finalProfileType = requestedType;

        Profile profile = profileRepository.findByType(finalProfileType)
                .orElseThrow(() -> new NotFoundException("Profile not found: " + finalProfileType));

        PersonProfile personProfile = new PersonProfile();
        personProfile.setPerson(person);
        personProfile.setProfile(profile);
        person.setPersonProfile(Collections.singletonList(personProfile));

        Person savedPerson = personRepository.save(person);
        sendSuccessEmail(savedPerson);
        return toResponseDTO(savedPerson);
    }

    @Transactional
    public PersonResponseDTO update(Long id, PersonUpdateDTO requestDTO) {
        Person person = findById(id);

        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth != null && auth.isAuthenticated()) {
            String currentUserEmail = auth.getName();
            boolean isAdmin = auth.getAuthorities().stream()
                    .anyMatch(a -> a.getAuthority().equals("ADMIN"));

            if (!person.getEmail().equals(currentUserEmail) && !isAdmin) {
                throw new BusinessException("You don't have permission to update this user");
            }
        }

        if (!person.getEmail().equals(requestDTO.getEmail()) &&
                personRepository.existsByEmail(requestDTO.getEmail())) {
            throw new BusinessException("Email already exists: " + requestDTO.getEmail());
        }

        person.setName(requestDTO.getName());
        person.setEmail(requestDTO.getEmail());

        Person updatedPerson = personRepository.save(person);
        return toResponseDTO(updatedPerson);
    }

    @Transactional
    public void delete(Long id) {
        Person person = findById(id);

        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth != null && auth.isAuthenticated()) {
            boolean isAdmin = auth.getAuthorities().stream()
                    .anyMatch(a -> a.getAuthority().equals("ADMIN"));

            if (!isAdmin) {
                throw new BusinessException("Only ADMIN can delete users");
            }
        }

        personRepository.delete(person);
    }

    public Person findById(Long id) {
        return personRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Person not found with id: " + id));
    }

    public PersonResponseDTO findByIdDTO(Long id) {
        Person person = findById(id);
        return toResponseDTO(person);
    }

    public PersonResponseDTO getCurrentUserProfile() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || !auth.isAuthenticated()) {
            throw new BusinessException("User not authenticated");
        }
        
        String email = auth.getName();
        Person person = personRepository.findByEmail(email)
                .orElseThrow(() -> new NotFoundException("User not found with email: " + email));
        
        return toResponseDTO(person);
    }

    public Page<PersonResponseDTO> findAll(Pageable pageable) {
        return personRepository.findAll(pageable).map(this::toResponseDTO);
    }

    public Page<PersonResponseDTO> search(String searchTerm, Pageable pageable) {
        if (searchTerm == null || searchTerm.trim().isEmpty()) {
            return findAll(pageable);
        }
        return personRepository.searchByNameOrEmail(searchTerm.trim(), pageable)
                .map(this::toResponseDTO);
    }

    public PersonResponseDTO toResponseDTO(Person person) {
        PersonResponseDTO dto = new PersonResponseDTO();
        dto.setId(person.getId());
        dto.setName(person.getName());
        dto.setEmail(person.getEmail());

        if (person.getPersonProfiles() != null && !person.getPersonProfiles().isEmpty()) {
            List<String> profiles = person.getPersonProfiles().stream()
                    .map(pp -> pp.getProfile().getType().name())
                    .collect(Collectors.toList());
            dto.setProfiles(profiles);
        } else {
            dto.setProfiles(new ArrayList<>());
        }
        
        Double averageRating = feedbackRepository.getAverageRatingByRecipientId(person.getId());
        Long totalFeedbacks = feedbackRepository.countByRecipientId(person.getId());
        
        dto.setAverageRating(averageRating != null ? averageRating : 0.0);
        dto.setTotalFeedbacks(totalFeedbacks != null ? totalFeedbacks.intValue() : 0);

        return dto;
    }
}

