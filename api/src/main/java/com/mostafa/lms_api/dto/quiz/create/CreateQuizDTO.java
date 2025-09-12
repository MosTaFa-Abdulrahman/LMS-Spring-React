package com.mostafa.lms_api.dto.quiz.create;

import jakarta.validation.Valid;
import jakarta.validation.constraints.*;

import java.time.ZonedDateTime;
import java.util.List;
import java.util.UUID;

public record CreateQuizDTO(
        @NotBlank(message = "Title is required")
        @Size(max = 500, message = "Title must not exceed 500 characters")
        String title,

        @NotBlank(message = "Description is required")
        @Size(max = 1000, message = "Description must not exceed 1000 characters")
        String description,

        @NotNull(message = "Start time is required")
        @Future(message = "Start time must be in the future")
        ZonedDateTime startTime,

        @NotNull(message = "End time is required")
        @Future(message = "End time must be in the future")
        ZonedDateTime endTime,

        @Valid
        @NotEmpty(message = "Quiz must have at least one question")
        @Size(max = 50, message = "Quiz cannot have more than 50 questions")
        List<CreateQuestionDTO> questions,

        @NotNull(message = "Course ID is required")
        UUID courseId,
        @NotNull(message = "User ID is required")
        UUID userId
) {
}
