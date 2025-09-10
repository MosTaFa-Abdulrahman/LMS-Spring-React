package com.mostafa.lms_api.dto.file;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

import java.util.UUID;

public record UpdateFileDTO(
        @NotBlank(message = "File title is required")
        @Size(min = 3, max = 200, message = "File title must be between 3 and 200 characters")
        String title,

        Boolean isPreview,


        UUID sectionId
) {
}
