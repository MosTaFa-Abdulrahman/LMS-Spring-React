package com.mostafa.lms_api.dto.quiz.update;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.time.ZonedDateTime;
import java.util.List;
import java.util.UUID;

public record UpdateQuizDTO(
        @NotNull(message = "Quiz ID is required")
        UUID id,

        @NotBlank(message = "Title is required")
        @Size(max = 900, message = "Title must not exceed 900 characters")
        String title,

        @NotBlank(message = "Description is required")
        @Size(max = 1000, message = "Description must not exceed 1000 characters")
        String description,

        @NotNull(message = "Start time is required")
        ZonedDateTime startTime,

        @NotNull(message = "End time is required")
        ZonedDateTime endTime,


        @Valid
        @NotEmpty(message = "Quiz must have at least one question")
        @Size(max = 50, message = "Quiz cannot have more than 50 questions")
        List<UpdateQuestionDTO> questions
) {
}
