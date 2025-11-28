package com.github.felxx.backend.controller;

import com.github.felxx.backend.dto.category.CategoryRequestDTO;
import com.github.felxx.backend.dto.category.CategoryResponseDTO;
import com.github.felxx.backend.service.CategoryService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@Slf4j
@RequiredArgsConstructor
@RestController
@RequestMapping("/categories")
public class CategoryController {

    private final CategoryService categoryService;

    @PostMapping
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<CategoryResponseDTO> insert(@Valid @RequestBody CategoryRequestDTO categoryDTO) {
        log.info("Creating new category: {}", categoryDTO.getName());
        CategoryResponseDTO created = categoryService.insert(categoryDTO);
        log.info("Category created successfully with ID: {}", created.getId());
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<CategoryResponseDTO> update(
            @PathVariable("id") Long id, 
            @Valid @RequestBody CategoryRequestDTO categoryDTO) {
        log.info("Updating category with ID: {}", id);
        CategoryResponseDTO updated = categoryService.update(id, categoryDTO);
        log.info("Category updated successfully: {}", id);
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<Void> delete(@PathVariable("id") Long id) {
        log.info("Deleting category with ID: {}", id);
        categoryService.delete(id);
        log.info("Category deleted successfully: {}", id);
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