package com.github.felxx.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.github.felxx.backend.model.Person;

public interface PersonRepository extends JpaRepository<Person, Long> {
    
}
