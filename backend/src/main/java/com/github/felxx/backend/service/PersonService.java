package com.github.felxx.backend.service;

import java.util.List;
import java.util.NoSuchElementException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.MessageSource;
import org.springframework.context.i18n.LocaleContextHolder;
import org.springframework.stereotype.Service;

import com.github.felxx.backend.model.Person;
import com.github.felxx.backend.repository.PersonRepository;

@Service
public class PersonService {
    @Autowired
    private PersonRepository personRepository;

    @Autowired
    private MessageSource messageSource;

    public Person insert(Person person) {
        return personRepository.save(person);
    }

    public Person update(Person person) {
        Person personDatabase = findById(person.getId());
        personDatabase.setName(person.getName());
        personDatabase.setEmail(person.getEmail());
        return personRepository.save(personDatabase);

    }

    public void delete(Long id) {
        Person personDatabase = findById(id);
        personRepository.delete(personDatabase);
    }

    public Person findById(Long id) {
        return personRepository.findById(id)
                .orElseThrow(() -> new NoSuchElementException(messageSource.getMessage("person.notfound",
                        new Object[] { id }, LocaleContextHolder.getLocale())));
    }

    public List<Person> findAll(){
        return personRepository.findAll();
    }
}
