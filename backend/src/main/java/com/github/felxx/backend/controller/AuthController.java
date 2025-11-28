package com.github.felxx.backend.controller;

import com.github.felxx.backend.dto.auth.AuthRequest;
import com.github.felxx.backend.dto.auth.AuthResponse;
import com.github.felxx.backend.dto.auth.ChangePasswordRequest;
import com.github.felxx.backend.dto.auth.ForgotPasswordRequest;
import com.github.felxx.backend.dto.auth.RegisterRequest;
import com.github.felxx.backend.dto.auth.ResetPasswordRequest;
import com.github.felxx.backend.service.AuthService;
import com.github.felxx.backend.service.PasswordService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import jakarta.validation.Valid;

@Slf4j
@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;
    private final PasswordService passwordService;

    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(@RequestBody @Valid RegisterRequest request) {
        log.info("New user registration attempt for email: {}", request.getEmail());
        AuthResponse response = authService.register(request);
        log.info("User registered successfully: {}", request.getEmail());
        return ResponseEntity.ok(response);
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@RequestBody @Valid AuthRequest request) {
        log.info("Login attempt for email: {}", request.getEmail());
        AuthResponse response = authService.authenticate(request);
        log.info("User logged in successfully: {}", request.getEmail());
        return ResponseEntity.ok(response);
    }

    @PostMapping("/forgot-password")
    public ResponseEntity<String> forgotPassword(@Valid @RequestBody ForgotPasswordRequest request) {
        log.info("Password reset requested for email: {}", request.getEmail());
        passwordService.requestPasswordReset(request);
        log.info("Password reset email sent to: {}", request.getEmail());
        return ResponseEntity.ok("Password reset email sent successfully");
    }

    @PostMapping("/reset-password")
    public ResponseEntity<String> resetPassword(@Valid @RequestBody ResetPasswordRequest request) {
        log.info("Password reset with token");
        passwordService.resetPassword(request);
        log.info("Password reset completed successfully");
        return ResponseEntity.ok("Password reset successfully");
    }

    @PostMapping("/change-password")
    public ResponseEntity<String> changePassword(@Valid @RequestBody ChangePasswordRequest request, Authentication authentication) {
        String userEmail = authentication.getName();
        log.info("Password change requested for user: {}", userEmail);
        passwordService.changePassword(userEmail, request);
        log.info("Password changed successfully for user: {}", userEmail);
        return ResponseEntity.ok("Password changed successfully");
    }
}