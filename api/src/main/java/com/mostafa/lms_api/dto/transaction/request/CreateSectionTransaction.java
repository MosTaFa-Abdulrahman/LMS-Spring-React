package com.mostafa.lms_api.dto.transaction.request;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.math.BigDecimal;
import java.util.List;

public record CreateSectionTransaction(
        @NotBlank(message = "Section title is required")
        @Size(min = 3, max = 1200, message = "Section title must be between 3 and 1200 characters")
        String title,

        @Size(max = 3000, message = "Description cannot exceed 3000 characters")
        String description,

        @NotNull(message = "Section price is required")
        BigDecimal price,

        @NotNull(message = "Sort order is required")
        Integer sortOrder,


        @Valid
        List<CreateVideoTransaction> videos,

        @Valid
        List<CreateFileTransaction> files
) {
}
