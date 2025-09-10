package com.mostafa.lms_api.dto.enrollment;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PositiveOrZero;

import java.math.BigDecimal;
import java.util.UUID;

public record CreateEnrollmentDTO(
        @PositiveOrZero(message = "Amount paid must be positive or zero")
        BigDecimal amountPaid,


        @NotNull(message = "User ID is required")
        UUID userId,

        @NotNull(message = "Section ID is required")
        UUID sectionId
) {
}
