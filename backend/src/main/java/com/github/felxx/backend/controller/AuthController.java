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
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;
    private final PasswordService passwordService;

    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(@RequestBody RegisterRequest request) {
        return ResponseEntity.ok(authService.register(request));
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@RequestBody AuthRequest request) {
        return ResponseEntity.ok(authService.authenticate(request));
    }

    @PostMapping("/forgot-password")
    public ResponseEntity<String> forgotPassword(@Valid @RequestBody ForgotPasswordRequest request) {
        passwordService.requestPasswordReset(request);
        return ResponseEntity.ok("Password reset email sent successfully");
    }

    @PostMapping("/reset-password")
    public ResponseEntity<String> resetPassword(@Valid @RequestBody ResetPasswordRequest request) {
        passwordService.resetPassword(request);
        return ResponseEntity.ok("Password reset successfully");
    }

    @PostMapping("/change-password")
    public ResponseEntity<String> changePassword(@Valid @RequestBody ChangePasswordRequest request, Authentication authentication) {
        String userEmail = authentication.getName();
        passwordService.changePassword(userEmail, request);
        return ResponseEntity.ok("Password changed successfully");
    }
}