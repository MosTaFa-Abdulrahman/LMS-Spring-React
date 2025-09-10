package com.mostafa.lms_api.dto.file;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

import java.util.UUID;

public record CreateFileDTO(
        @NotNull(message = "File title is required")
        @Size(min = 3, max = 200, message = "File title must be between 3 and 200 characters")
        String title,

        @NotNull(message = "File URL is required")
        @Pattern(
                regexp = "^(https?://).+",
                message = "File URL must be a valid URL starting with http or https"
        )
        String fileUrl,


        @NotNull(message = "Section ID is required")
        UUID sectionId
) {
}
