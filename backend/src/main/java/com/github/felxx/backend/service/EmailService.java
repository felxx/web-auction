package com.github.felxx.backend.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.thymeleaf.TemplateEngine;
import org.thymeleaf.context.Context;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;

@Service
public class EmailService {
    
    @Autowired
    private JavaMailSender javaMail;

    @Autowired
    private TemplateEngine templateEngine;
    
    @Async
    public void sendSimpleMail(String to, String subject, String content) {
        SimpleMailMessage simpleMailMessage = new SimpleMailMessage();
        simpleMailMessage.setTo(to);
        simpleMailMessage.setSubject(subject);
        simpleMailMessage.setText(content);
        javaMail.send(simpleMailMessage);
    }

    @Async
    public void sendTemplateMail(String to, String subject, Context emailVariables, String templateFileName){
        
        String process = templateEngine.process(templateFileName, emailVariables);

        MimeMessage message = javaMail.createMimeMessage();
        MimeMessageHelper helper;
        try{
            helper = new MimeMessageHelper(message);
            helper.setTo(to);
            helper.setSubject(subject);
            helper.setText(process, true);
        } catch ( MessagingException e) {
            e.printStackTrace();
        }

        javaMail.send(message);
    }
}
