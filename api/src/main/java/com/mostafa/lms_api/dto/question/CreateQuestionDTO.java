package com.mostafa.lms_api.dto.question;

import com.mostafa.lms_api.dto.choice.CreateChoiceDTO;
import jakarta.validation.Valid;
import jakarta.validation.constraints.*;

import java.util.List;


public record CreateQuestionDTO(
        @NotBlank(message = "Question text is required")
        @Size(min = 10, max = 500, message = "Question text must be between 10 and 500 characters")
        String text,

        String questionImage,

        @NotBlank(message = "Correct answer is required")
        @Size(min = 1, max = 200, message = "Correct answer must be between 1 and 200 characters")
        String correctAnswer,

        @NotNull(message = "Points is required")
        @DecimalMin(value = "0.5", message = "Points must be at least 0.5")
        @DecimalMax(value = "100.0", message = "Points cannot exceed 100.0")
        Double points,


        @Valid
        @NotEmpty(message = "Choices list cannot be empty")
        @Size(min = 2, max = 9, message = "Question must have between 2 and 9 choices")
        List<CreateChoiceDTO> choices
) {
    // Custom validation to ensure exactly one correct answer
    public boolean hasExactlyOneCorrectAnswer() {
        if (choices == null) return false;
        long correctCount = choices.stream()
                .filter(choice -> Boolean.TRUE.equals(choice.isCorrect()))
                .count();
        return correctCount == 1;
    }


}
