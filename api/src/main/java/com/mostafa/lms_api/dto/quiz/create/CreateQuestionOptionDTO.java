package com.mostafa.lms_api.dto.quiz.create;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record CreateQuestionOptionDTO(
        @NotBlank(message = "Option text is required")
        @Size(max = 900, message = "Option text must not exceed 900 characters")
        String optionText,

        @NotBlank(message = "Option select is required")
        String optionSelect,

        @NotNull(message = "isCorrect flag is required")
        Boolean isCorrect
) {
}
