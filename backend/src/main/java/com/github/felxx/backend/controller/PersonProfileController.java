package com.github.felxx.backend.controller;

import com.github.felxx.backend.model.PersonProfile;
import com.github.felxx.backend.service.PersonProfileService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/person-profiles")
@RequiredArgsConstructor
public class PersonProfileController {

    private final PersonProfileService personProfileService;

    @PostMapping
    public ResponseEntity<PersonProfile> insert(@Valid @RequestBody PersonProfile personProfile) {
        return ResponseEntity.ok(personProfileService.insert(personProfile));
    }

    @PutMapping("/{id}")
    public ResponseEntity<PersonProfile> update(@PathVariable("id") Long id, @Valid @RequestBody PersonProfile personProfile) {
        return ResponseEntity.ok(personProfileService.update(id, personProfile));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable("id") Long id) {
        personProfileService.delete(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/{id}")
    public ResponseEntity<PersonProfile> findById(@PathVariable("id") Long id) {
        return ResponseEntity.ok(personProfileService.findById(id));
    }

    @GetMapping
    public ResponseEntity<Page<PersonProfile>> findAll(Pageable pageable) {
        return ResponseEntity.ok(personProfileService.findAll(pageable));
    }

    @GetMapping("/person/{personId}")
    public ResponseEntity<Page<PersonProfile>> findByPerson(@PathVariable("personId") Long personId, Pageable pageable) {
        return ResponseEntity.ok(personProfileService.findByPerson(personId, pageable));
    }

    @GetMapping("/profile/{profileId}")
    public ResponseEntity<Page<PersonProfile>> findByProfile(@PathVariable("profileId") Integer profileId, Pageable pageable) {
        return ResponseEntity.ok(personProfileService.findByProfile(profileId, pageable));
    }
}
