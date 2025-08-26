package com.github.felxx.backend.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.MessageSource;
import org.springframework.context.i18n.LocaleContextHolder;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.thymeleaf.context.Context;

import com.github.felxx.backend.exception.NotFoundException;
import com.github.felxx.backend.model.Person;
import com.github.felxx.backend.repository.PersonRepository;

@Service
public class PersonService {
    @Autowired
    private PersonRepository personRepository;

    @Autowired
    private MessageSource messageSource;

    @Autowired
    private EmailService emailService;

    private void sendSuccessEmail(Person person) {
        Context context = new Context();
        context.setVariable("name", person.getName());
        emailService.sendTemplateMail(person.getEmail(), "Successfully registration!", context, "successRegister");
    }

    public Person insert(Person person) {
        Person registeredPerson = personRepository.save(person);
        sendSuccessEmail(registeredPerson);
        return registeredPerson;
    }

    public Person update(Long id, Person person) {
        Person personDatabase = findById(id);
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
                .orElseThrow(() -> new NotFoundException(messageSource.getMessage("person.notfound",
                        new Object[] { id }, LocaleContextHolder.getLocale())));
    }

    public Page<Person> findAll(Pageable pageable) {
        return personRepository.findAll(pageable);
    }
}
