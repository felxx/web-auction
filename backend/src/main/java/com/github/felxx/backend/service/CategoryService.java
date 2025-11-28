package com.github.felxx.backend.service;

import com.github.felxx.backend.dto.category.CategoryRequestDTO;
import com.github.felxx.backend.dto.category.CategoryResponseDTO;
import com.github.felxx.backend.exception.NotFoundException;
import com.github.felxx.backend.model.Category;
import com.github.felxx.backend.model.Person;
import com.github.felxx.backend.repository.CategoryRepository;
import com.github.felxx.backend.repository.PersonRepository;
import io.micrometer.core.annotation.Counted;
import io.micrometer.core.annotation.Timed;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Slf4j
@Service
@RequiredArgsConstructor
public class CategoryService {

    private final CategoryRepository categoryRepository;
    private final PersonRepository personRepository;

    @Transactional
    @Timed(value = "categories.create.time", description = "Tempo de criação de categoria")
    @Counted(value = "categories.create.count", description = "Quantidade de categorias criadas")
    public CategoryResponseDTO insert(CategoryRequestDTO requestDTO) {
        log.info("Creating new category: {}", requestDTO.getName());
        Category category = new Category();
        category.setName(requestDTO.getName());
        category.setDescription(requestDTO.getDescription());
        
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication != null && authentication.isAuthenticated()) {
            String email = authentication.getName();
            Person creator = personRepository.findByEmail(email)
                    .orElseThrow(() -> new NotFoundException("User not found"));
            category.setCreator(creator);
        }
        
        Category savedCategory = categoryRepository.save(category);
        log.info("Category created successfully with ID: {}", savedCategory.getId());
        return toResponseDTO(savedCategory);
    }

    @Transactional
    public CategoryResponseDTO update(Long id, CategoryRequestDTO requestDTO) {
        log.info("Updating category with ID: {}", id);
        Category existingCategory = findById(id);
        existingCategory.setName(requestDTO.getName());
        existingCategory.setDescription(requestDTO.getDescription());
        Category updatedCategory = categoryRepository.save(existingCategory);
        log.info("Category updated successfully: {}", id);
        return toResponseDTO(updatedCategory);
    }

    @Transactional
    public void delete(Long id) {
        log.info("Deleting category with ID: {}", id);
        Category category = findById(id);
        categoryRepository.delete(category);
        log.info("Category deleted successfully: {}", id);
    }

    public Category findById(Long id) {
        return categoryRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Category not found with id: " + id));
    }

    public CategoryResponseDTO findByIdDTO(Long id) {
        Category category = findById(id);
        return toResponseDTO(category);
    }

    public Page<CategoryResponseDTO> findAll(Pageable pageable) {
        return categoryRepository.findAll(pageable).map(this::toResponseDTO);
    }

    public Page<CategoryResponseDTO> search(String searchTerm, Pageable pageable) {
        if (searchTerm == null || searchTerm.trim().isEmpty()) {
            return findAll(pageable);
        }
        return categoryRepository.searchByNameOrDescription(searchTerm.trim(), pageable)
                .map(this::toResponseDTO);
    }

    private CategoryResponseDTO toResponseDTO(Category category) {
        CategoryResponseDTO dto = new CategoryResponseDTO();
        dto.setId(category.getId());
        dto.setName(category.getName());
        dto.setDescription(category.getDescription());
        if (category.getCreator() != null) {
            dto.setCreatorId(category.getCreator().getId());
            dto.setCreatorName(category.getCreator().getName());
        }
        return dto;
    }
}