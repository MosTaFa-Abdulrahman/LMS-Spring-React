package com.mostafa.lms_api.dto.section;

import jakarta.validation.constraints.*;

import java.math.BigDecimal;

public record UpdateSectionDTO(
        @NotBlank(message = "Course title is required")
        @Size(min = 3, max = 200, message = "Course title must be between 3 and 200 characters")
        String title,

        @Size(max = 2000, message = "Description cannot exceed 2000 characters")
        String description,

        @DecimalMin(value = "0.0", inclusive = false, message = "Price must be greater than 0")
        @DecimalMax(value = "99999.99", message = "Price cannot exceed 99,999.99")
        @Digits(integer = 5, fraction = 2, message = "Price must have maximum 5 integer digits and 2 decimal places")
        BigDecimal price,

        @Min(value = 1, message = "Rating cannot be negative or zero")
        @Max(value = 5, message = "Rating cannot be Greater than 5")
        Integer sortOrder
) {
}
