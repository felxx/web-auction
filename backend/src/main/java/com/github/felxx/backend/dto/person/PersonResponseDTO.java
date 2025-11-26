package com.github.felxx.backend.dto.person;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PersonResponseDTO {
    
    private Long id;
    private String name;
    private String email;
    private List<String> profiles;
}
