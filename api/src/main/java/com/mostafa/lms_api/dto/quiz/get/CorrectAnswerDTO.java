package com.mostafa.lms_api.dto.quiz.get;

import java.util.UUID;

public record CorrectAnswerDTO(
        UUID id,
        String optionText,
        String optionSelect
) {
}
