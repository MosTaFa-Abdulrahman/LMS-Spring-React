package com.mostafa.lms_api.dto.quiz.get;

import java.util.UUID;

public record QuestionOptionResponseDTO(
        UUID id,
        String optionText,
        String optionSelect,


        Boolean isCorrect // Hide if (((Role === USER)))
) {
}
