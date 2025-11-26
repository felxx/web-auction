package com.github.felxx.backend.dto.category;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CategoryResponseDTO {
    
    private Long id;
    private String name;
    private String description;
    private String creatorName;
    private Long creatorId;
}
