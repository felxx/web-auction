package com.github.felxx.backend.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.github.felxx.backend.dto.person.PersonRequestDTO;
import com.github.felxx.backend.dto.person.PersonResponseDTO;
import com.github.felxx.backend.dto.person.PersonUpdateDTO;
import com.github.felxx.backend.service.PersonService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/persons")
public class PersonController {

    @Autowired
    private PersonService personService;

    @GetMapping("/{id}")
    public ResponseEntity<PersonResponseDTO> findById(@PathVariable("id") Long id) {
        PersonResponseDTO person = personService.toResponseDTO(personService.findById(id));
        return ResponseEntity.ok(person);
    }

    @GetMapping
    public ResponseEntity<Page<PersonResponseDTO>> findAll(
            @RequestParam(required = false) String search,
            Pageable pageable) {
        if (search != null && !search.trim().isEmpty()) {
            return ResponseEntity.ok(personService.search(search, pageable));
        }
        return ResponseEntity.ok(personService.findAll(pageable));
    }

    @PostMapping
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<PersonResponseDTO> insert(@Valid @RequestBody PersonRequestDTO requestDTO) {
        PersonResponseDTO response = personService.insert(requestDTO);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @PutMapping("/{id}")
    public ResponseEntity<PersonResponseDTO> update(
            @PathVariable("id") Long id,
            @Valid @RequestBody PersonUpdateDTO requestDTO) {
        PersonResponseDTO response = personService.update(id, requestDTO);
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<Void> delete(@PathVariable("id") Long id) {
        personService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
