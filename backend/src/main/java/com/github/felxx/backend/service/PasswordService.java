package com.github.felxx.backend.service;

import com.github.felxx.backend.dto.auth.ChangePasswordRequest;
import com.github.felxx.backend.dto.auth.ForgotPasswordRequest;
import com.github.felxx.backend.dto.auth.ResetPasswordRequest;
import com.github.felxx.backend.exception.BusinessException;
import com.github.felxx.backend.exception.NotFoundException;
import com.github.felxx.backend.model.Person;
import com.github.felxx.backend.repository.PersonRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.thymeleaf.context.Context;

import java.security.SecureRandom;
import java.time.LocalDateTime;
import java.util.Base64;

@Service
@RequiredArgsConstructor
public class PasswordService {

    private final PersonRepository personRepository;
    private final PasswordEncoder passwordEncoder;
    private final EmailService emailService;
    private final SecureRandom secureRandom = new SecureRandom();

    @Value("${app.frontend.url}")
    private String frontendUrl;

    public void requestPasswordReset(ForgotPasswordRequest request) {
        Person person = personRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new NotFoundException("User not found with email: " + request.getEmail()));

        String resetToken = generateSecureToken();
        person.setValidationCode(resetToken);
        person.setValidationCodeExpiration(LocalDateTime.now().plusHours(1));
        
        personRepository.save(person);
        
        sendPasswordResetEmail(person.getEmail(), person.getName(), resetToken);
    }

    public void resetPassword(ResetPasswordRequest request) {
        Person person = personRepository.findByValidationCode(request.getToken())
                .orElseThrow(() -> new BusinessException("Invalid or expired reset token"));

        if (person.getValidationCodeExpiration().isBefore(LocalDateTime.now())) {
            throw new BusinessException("Reset token has expired");
        }

        person.setPassword(passwordEncoder.encode(request.getNewPassword()));
        person.setValidationCode(null);
        person.setValidationCodeExpiration(null);
        
        personRepository.save(person);
    }

    public void changePassword(String userEmail, ChangePasswordRequest request) {
        Person person = personRepository.findByEmail(userEmail)
                .orElseThrow(() -> new NotFoundException("User not found"));

        if (!passwordEncoder.matches(request.getCurrentPassword(), person.getPassword())) {
            throw new BusinessException("Current password is incorrect");
        }

        person.setPassword(passwordEncoder.encode(request.getNewPassword()));
        personRepository.save(person);
    }

    private String generateSecureToken() {
        byte[] tokenBytes = new byte[32];
        secureRandom.nextBytes(tokenBytes);
        return Base64.getUrlEncoder().withoutPadding().encodeToString(tokenBytes);
    }

    private void sendPasswordResetEmail(String email, String name, String resetToken) {
        String resetUrl = frontendUrl + "/auth/reset-password?token=" + resetToken;
        
        Context context = new Context();
        context.setVariable("name", name);
        context.setVariable("resetUrl", resetUrl);
        
        String subject = "Password Reset Request";
        
        try {
            emailService.sendTemplateMail(email, subject, context, "passwordReset");
        } catch (Exception e) {
            String fallbackContent = String.format(
                "Hello %s,\n\n" +
                "You have requested to reset your password. Please click the link below to reset your password:\n\n" +
                "%s\n\n" +
                "This link will expire in 1 hour.\n\n" +
                "If you did not request this password reset, please ignore this email.\n\n" +
                "Best regards,\n" +
                "Web Auction Team",
                name, resetUrl
            );
            emailService.sendSimpleMail(email, subject, fallbackContent);
        }
    }
}
