package com.github.felxx.backend.dto.profile;

import com.github.felxx.backend.model.ProfileType;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ProfileRequestDTO {
    
    @NotNull(message = "Profile type cannot be null")
    private ProfileType type;
}
