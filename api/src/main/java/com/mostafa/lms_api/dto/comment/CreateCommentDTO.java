package com.mostafa.lms_api.dto.comment;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.util.UUID;

public record CreateCommentDTO(
        @NotNull(message = "Text is required")
        @Size(max = 1600, message = "Text cannot exceed 1600 characters")
        String text,


        @NotNull(message = "User ID is required")
        UUID userId,
        @NotNull(message = "Post ID is required")
        UUID postId
) {
}
