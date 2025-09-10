package com.mostafa.lms_api.dto.choice;

import java.util.UUID;

public record ChoiceResponseDTO(
        UUID id,
        String choiceText,
        String choiceLabel,
        Boolean isCorrect
) {
}
