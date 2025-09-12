package com.mostafa.lms_api.dto.quiz.update;

import jakarta.validation.Valid;
import jakarta.validation.constraints.*;

import java.util.List;
import java.util.UUID;

public record UpdateQuestionDTO(
        UUID id, // null for new questions

        @NotBlank(message = "Question text is required")
        @Size(max = 2000, message = "Question text must not exceed 2000 characters")
        String questionText,

        @DecimalMin(value = "0.25", message = "Points must be at least 0.25")
        @DecimalMax(value = "100.0", message = "Points cannot exceed 100")
        Double points,

        @Valid
        @NotEmpty(message = "Question must have at least 2 options")
        @Size(min = 2, max = 6, message = "Question must have between 2 and 6 options")
        List<UpdateQuestionOptionDTO> options
) {
}
