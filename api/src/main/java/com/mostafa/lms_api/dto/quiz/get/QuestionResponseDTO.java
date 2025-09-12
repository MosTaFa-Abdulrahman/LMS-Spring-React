package com.mostafa.lms_api.dto.quiz.get;

import java.util.List;
import java.util.UUID;

public record QuestionResponseDTO(
        UUID id,
        String questionText,
        Double points,


        List<QuestionOptionResponseDTO> options
) {
}
