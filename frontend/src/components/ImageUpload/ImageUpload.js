import React, { useState, useRef } from 'react';
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';
import './ImageUpload.css';

const ImageUpload = ({ onImagesChange, maxImages = 5, existingImages = [] }) => {
    const [images, setImages] = useState(existingImages);
    const [isDragging, setIsDragging] = useState(false);
    const fileInputRef = useRef(null);
    const toast = useRef(null);

    const MAX_FILE_SIZE = 5 * 1024 * 1024;
    const ALLOWED_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];

    const validateFile = (file) => {
        if (file.size > MAX_FILE_SIZE) {
            toast.current?.show({
                severity: 'error',
                summary: 'File too large',
                detail: `${file.name} exceeds 10MB limit`,
                life: 3000
            });
            return false;
        }

        if (!ALLOWED_TYPES.includes(file.type)) {
            toast.current?.show({
                severity: 'error',
                summary: 'Invalid file type',
                detail: `${file.name} is not a valid image format`,
                life: 3000
            });
            return false;
        }

        return true;
    };

    const processFiles = (files) => {
        const fileArray = Array.from(files);
        const validFiles = fileArray.filter(validateFile);

        if (images.length + validFiles.length > maxImages) {
            toast.current?.show({
                severity: 'warn',
                summary: 'Too many images',
                detail: `Maximum ${maxImages} images allowed`,
                life: 3000
            });
            return;
        }

        const newImages = validFiles.map((file) => ({
            file,
            preview: URL.createObjectURL(file),
            name: file.name
        }));

        const updatedImages = [...images, ...newImages];
        setImages(updatedImages);
        onImagesChange(updatedImages);
    };

    const handleFileSelect = (e) => {
        const files = e.target.files;
        if (files.length > 0) {
            processFiles(files);
        }
        e.target.value = '';
    };

    const handleDragEnter = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(true);
    };

    const handleDragLeave = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
    };

    const handleDragOver = (e) => {
        e.preventDefault();
        e.stopPropagation();
    };

    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);

        const files = e.dataTransfer.files;
        if (files.length > 0) {
            processFiles(files);
        }
    };

    const removeImage = (index) => {
        const updatedImages = images.filter((_, i) => i !== index);
        setImages(updatedImages);
        onImagesChange(updatedImages);
    };

    const moveImage = (fromIndex, toIndex) => {
        const updatedImages = [...images];
        const [movedImage] = updatedImages.splice(fromIndex, 1);
        updatedImages.splice(toIndex, 0, movedImage);
        setImages(updatedImages);
        onImagesChange(updatedImages);
    };

    return (
        <div className="image-upload-container">
            <Toast ref={toast} />
            
            <div
                className={`upload-dropzone ${isDragging ? 'dragging' : ''} ${images.length >= maxImages ? 'disabled' : ''}`}
                onDragEnter={handleDragEnter}
                onDragLeave={handleDragLeave}
                onDragOver={handleDragOver}
                onDrop={handleDrop}
                onClick={() => images.length < maxImages && fileInputRef.current?.click()}
            >
                <i className="pi pi-cloud-upload" style={{ fontSize: '3rem' }}></i>
                <p className="upload-text">
                    Drag and drop images here or click to select
                </p>
                <p className="upload-hint">
                    Maximum {maxImages} images, 10MB each (JPEG, PNG, GIF, WEBP)
                </p>
                <p className="upload-info">
                    First image will be the main cover
                </p>
            </div>

            <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
                multiple
                onChange={handleFileSelect}
                style={{ display: 'none' }}
            />

            {images.length > 0 && (
                <div className="image-preview-container">
                    <h4>Selected Images ({images.length}/{maxImages})</h4>
                    <div className="image-preview-grid">
                        {images.map((image, index) => (
                            <div key={index} className={`image-preview-item ${index === 0 ? 'main-image' : ''}`}>
                                {index === 0 && <span className="main-badge">Main Cover</span>}
                                <img src={image.preview} alt={`Preview ${index + 1}`} />
                                <div className="image-preview-actions">
                                    {index > 0 && (
                                        <Button
                                            icon="pi pi-arrow-left"
                                            className="p-button-sm p-button-rounded"
                                            onClick={() => moveImage(index, index - 1)}
                                            tooltip="Move left"
                                        />
                                    )}
                                    {index < images.length - 1 && (
                                        <Button
                                            icon="pi pi-arrow-right"
                                            className="p-button-sm p-button-rounded"
                                            onClick={() => moveImage(index, index + 1)}
                                            tooltip="Move right"
                                        />
                                    )}
                                    <Button
                                        icon="pi pi-times"
                                        className="p-button-sm p-button-rounded p-button-danger"
                                        onClick={() => removeImage(index)}
                                        tooltip="Remove"
                                    />
                                </div>
                                <p className="image-name">{image.name}</p>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default ImageUpload;
