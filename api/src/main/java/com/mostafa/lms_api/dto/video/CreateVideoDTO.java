package com.mostafa.lms_api.dto.video;

import jakarta.validation.constraints.*;

import java.util.UUID;

public record CreateVideoDTO(
        @NotBlank(message = "Course title is required")
        @Size(min = 3, max = 200, message = "Course title must be between 3 and 200 characters")
        String title,

        @NotBlank(message = "Video URL is required")
        @Pattern(
                regexp = "^(https?://).+",
                message = "Video URL must be a valid URL starting with http or https"
        )
        String videoUrl,

        @Min(value = 1, message = "Rating cannot be negative or zero")
        @Max(value = 60, message = "Rating cannot be Greater than 60")
        Integer sortOrder,

        @NotNull(message = "Duration is required")
        @Min(value = 1, message = "Duration must be at least 1 second")
        Integer durationSeconds,

        @NotNull(message = "Section ID is required")
        UUID sectionId
) {
}
