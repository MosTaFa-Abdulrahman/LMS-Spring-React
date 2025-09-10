package com.mostafa.lms_api.dto.question;

import com.mostafa.lms_api.dto.choice.UpdateChoiceDTO;
import jakarta.validation.constraints.DecimalMax;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Size;

import java.util.Map;
import java.util.UUID;


public record UpdateQuestionDTO(
        @Size(min = 10, max = 500, message = "Question text must be between 10 and 500 characters")
        String text,

        String questionImage,

        @DecimalMin(value = "0.5", message = "Points must be at least 0.5")
        @DecimalMax(value = "100.0", message = "Points cannot exceed 100.0")
        Double points,

        // Map of choiceId -> UpdateChoiceDTO for updating existing choices
        Map<UUID, UpdateChoiceDTO> choices
) {
}
