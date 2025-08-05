package com.github.felxx.backend.service;

import com.github.felxx.backend.exception.NotFoundException;
import com.github.felxx.backend.model.Category;
import com.github.felxx.backend.repository.CategoryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.BeanUtils;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class CategoryService {

    private final CategoryRepository categoryRepository;

    public Category insert(Category category) {
        return categoryRepository.save(category);
    }

    public Category update(Long id, Category category) {
        Category existingCategory = findById(id);
        BeanUtils.copyProperties(category, existingCategory, "id");
        return categoryRepository.save(existingCategory);
    }

    public void delete(Long id) {
        Category category = findById(id);
        categoryRepository.delete(category);
    }

    public Category findById(Long id) {
        return categoryRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Category not found!"));
    }

    public Page<Category> findAll(Pageable pageable) {
        return categoryRepository.findAll(pageable);
    }
}