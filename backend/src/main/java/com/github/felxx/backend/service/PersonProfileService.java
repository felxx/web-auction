package com.github.felxx.backend.service;

import com.github.felxx.backend.exception.NotFoundException;
import com.github.felxx.backend.model.PersonProfile;
import com.github.felxx.backend.repository.PersonProfileRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class PersonProfileService {

    private final PersonProfileRepository personProfileRepository;

    @Transactional
    public PersonProfile insert(PersonProfile personProfile) {
        return personProfileRepository.save(personProfile);
    }

    @Transactional
    public PersonProfile update(Long id, PersonProfile personProfile) {
        PersonProfile existingPersonProfile = findById(id);
        existingPersonProfile.setPerson(personProfile.getPerson());
        existingPersonProfile.setProfile(personProfile.getProfile());
        return personProfileRepository.save(existingPersonProfile);
    }

    @Transactional
    public void delete(Long id) {
        PersonProfile personProfile = findById(id);
        personProfileRepository.delete(personProfile);
    }

    public PersonProfile findById(Long id) {
        return personProfileRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("PersonProfile not found with id: " + id));
    }

    public Page<PersonProfile> findAll(Pageable pageable) {
        return personProfileRepository.findAll(pageable);
    }

    public Page<PersonProfile> findByPerson(Long personId, Pageable pageable) {
        return personProfileRepository.findByPersonId(personId, pageable);
    }

    public Page<PersonProfile> findByProfile(Integer profileId, Pageable pageable) {
        return personProfileRepository.findByProfileId(profileId, pageable);
    }
}
