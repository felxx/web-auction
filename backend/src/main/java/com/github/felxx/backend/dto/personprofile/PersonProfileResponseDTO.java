package com.github.felxx.backend.dto.personprofile;

import com.github.felxx.backend.dto.profile.ProfileResponseDTO;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PersonProfileResponseDTO {
    
    private Long id;
    private Long personId;
    private String personName;
    private ProfileResponseDTO profile;
}
