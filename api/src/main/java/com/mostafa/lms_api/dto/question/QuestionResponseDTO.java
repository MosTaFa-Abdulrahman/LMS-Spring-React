package com.mostafa.lms_api.dto.question;

import com.mostafa.lms_api.dto.choice.ChoiceResponseDTO;

import java.util.List;
import java.util.UUID;

public record QuestionResponseDTO(
        UUID id,
        String text,
        String questionImage,
        String userAnswer,
        String correctAnswerLabel,
        Double points,
        List<ChoiceResponseDTO> choices,
        Boolean isAnsweredCorrectly  // Changed from boolean to Boolean to allow null
) {
}
