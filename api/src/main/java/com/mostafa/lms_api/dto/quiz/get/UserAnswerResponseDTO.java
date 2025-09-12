package com.mostafa.lms_api.dto.quiz.get;

import java.time.ZonedDateTime;
import java.util.UUID;

public record UserAnswerResponseDTO(
        UUID id,
        UUID questionId,
        String questionText,
        UUID selectedOptionId,
        String selectedOptionText,
        String selectedOptionSelect,
        Boolean isCorrect,
        Double pointsEarned,
        ZonedDateTime answeredAt,


        CorrectAnswerDTO correctAnswer
) {
}
