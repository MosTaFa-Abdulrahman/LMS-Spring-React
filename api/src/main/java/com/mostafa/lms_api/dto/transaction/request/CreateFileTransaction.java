package com.mostafa.lms_api.dto.transaction.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record CreateFileTransaction(
        @NotBlank(message = "File title is required")
        @Size(min = 3, max = 200, message = "File title must be between 3 and 200 characters")
        String title,

        @NotBlank(message = "File URL is required")
        String fileUrl,


        Boolean isPreview
) {
}
