package com.mostafa.lms_api.dto.post;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;


public record UpdatePostDTO(
        @NotNull(message = "Text is required")
        @Size(max = 100, message = "Text cannot exceed 100 characters")
        String text
) {
}
