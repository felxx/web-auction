package com.github.felxx.backend.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.github.felxx.backend.model.Person;
import com.github.felxx.backend.service.PersonService;

import jakarta.validation.Valid;
import jakarta.websocket.server.PathParam;

@RestController
@RequestMapping("/person")
public class PersonController {

    @Autowired
    private PersonService personService;

    @GetMapping
    public ResponseEntity<List<Person>> findAll() {
        return ResponseEntity.ok(personService.findAll());
    }

    @PostMapping
    public ResponseEntity<Person> insert(@Valid @RequestBody Person person) {
        return ResponseEntity.ok(personService.insert(person));
    }

    @PutMapping
    public ResponseEntity<Person> update(@Valid @RequestBody Person person) {
        return ResponseEntity.ok(personService.update(person));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> delete(@PathParam("id") Long id) {
        personService.delete(id);
        return ResponseEntity.ok("Person deleted");
    }
}
