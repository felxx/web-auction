package com.github.felxx.backend.controller;

import com.github.felxx.backend.dto.category.CategoryRequestDTO;
import com.github.felxx.backend.dto.category.CategoryResponseDTO;
import com.github.felxx.backend.service.CategoryService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RequiredArgsConstructor
@RestController
@RequestMapping("/categories")
public class CategoryController {

    private final CategoryService categoryService;

    @PostMapping
    public ResponseEntity<CategoryResponseDTO> insert(@Valid @RequestBody CategoryRequestDTO categoryDTO) {
        CategoryResponseDTO created = categoryService.insert(categoryDTO);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    @PutMapping("/{id}")
    public ResponseEntity<CategoryResponseDTO> update(
            @PathVariable("id") Long id, 
            @Valid @RequestBody CategoryRequestDTO categoryDTO) {
        CategoryResponseDTO updated = categoryService.update(id, categoryDTO);
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable("id") Long id) {
        categoryService.delete(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping
    public ResponseEntity<Page<CategoryResponseDTO>> findAll(
            @RequestParam(required = false) String search,
            Pageable pageable) {
        Page<CategoryResponseDTO> categories = categoryService.search(search, pageable);
        return ResponseEntity.ok(categories);
    }

    @GetMapping("/{id}")
    public ResponseEntity<CategoryResponseDTO> findById(@PathVariable("id") Long id) {
        CategoryResponseDTO category = categoryService.findByIdDTO(id);
        return ResponseEntity.ok(category);
    }
}