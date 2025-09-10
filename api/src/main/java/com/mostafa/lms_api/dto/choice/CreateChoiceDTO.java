package com.mostafa.lms_api.dto.choice;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record CreateChoiceDTO(
        @NotBlank(message = "Choice text is required")
        @Size(min = 1, max = 500, message = "Choice text must be between 1 and 500 characters")
        String choiceText,

        @NotBlank(message = "Choice label is required")
        String choiceLabel,

        @NotNull(message = "Is correct flag is required")
        Boolean isCorrect
) {
}
