package com.mostafa.lms_api.dto.transaction.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record CreateVideoTransaction(
        @NotBlank(message = "Video title is required")
        @Size(min = 3, max = 1500, message = "Video title must be between 3 and 1500 characters")
        String title,

        @NotBlank(message = "Video URL is required")
        String videoUrl,

        @NotNull(message = "Sort order is required")
        Integer sortOrder,

        @NotNull(message = "Duration is required")
        Integer durationSeconds,


        Boolean isPreview
) {
}
