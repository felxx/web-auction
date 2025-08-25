package com.github.felxx.backend.dto.auth;

import lombok.Data;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

@Data
public class ResetPasswordRequest {
    
    @NotBlank(message = "Token is required")
    private String token;
    
    @NotBlank(message = "New password is required")
    @Size(min = 6, message = "New password must have at least 6 characters")
    @Pattern(
        regexp = "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]+$",
        message = "New password must contain at least one uppercase letter, one lowercase letter, one number, and one special character"
    )
    private String newPassword;
}
