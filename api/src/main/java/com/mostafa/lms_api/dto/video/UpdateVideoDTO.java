package com.mostafa.lms_api.dto.video;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

import java.util.UUID;

public record UpdateVideoDTO(
        @NotBlank(message = "Video title is required")
        @Size(min = 3, max = 200, message = "Video title must be between 3 and 200 characters")
        String title,

        @Min(value = 1, message = "Rating cannot be negative or zero")
        @Max(value = 60, message = "Rating cannot be Greater than 60")
        Integer sortOrder,

        @Min(value = 1, message = "Duration must be at least 1 second")
        Integer durationSeconds,

        Boolean isPreview,


        UUID sectionId
) {
}
