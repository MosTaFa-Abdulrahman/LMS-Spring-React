package com.mostafa.lms_api.dto.choice;

import jakarta.validation.constraints.Size;

public record UpdateChoiceDTO(
        @Size(min = 1, max = 500, message = "Choice text must be between 1 and 500 characters")
        String choiceText,

        String choiceLabel,

        Boolean isCorrect
) {
}
