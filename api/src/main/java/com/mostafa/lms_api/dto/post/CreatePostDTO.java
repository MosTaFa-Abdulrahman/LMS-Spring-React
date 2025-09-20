package com.mostafa.lms_api.dto.post;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.util.UUID;

public record CreatePostDTO(
        @Size(max = 1500, message = "Text cannot exceed 1500 characters")
        String text,

        String imageUrl,


        @NotNull(message = "User ID is required")
        UUID userId
) {
}
