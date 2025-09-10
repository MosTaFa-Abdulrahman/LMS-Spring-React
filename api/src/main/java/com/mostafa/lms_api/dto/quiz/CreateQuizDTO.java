package com.mostafa.lms_api.dto.quiz;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.mostafa.lms_api.dto.question.CreateQuestionDTO;
import jakarta.validation.Valid;
import jakarta.validation.constraints.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;


public record CreateQuizDTO(
        @NotBlank(message = "Title is required")
        @Size(min = 3, max = 200, message = "Title must be between 3 and 200 characters")
        String title,

        @Size(max = 1000, message = "Description cannot exceed 1000 characters")
        String description,

        @NotNull(message = "Start time is required")
        @Future(message = "Start time must be in the future")
        @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
        LocalDateTime startTime,

        @NotNull(message = "End time is required")
        @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
        LocalDateTime endTime,


        @Valid
        @NotEmpty(message = "Questions list cannot be empty")
        @Size(min = 1, max = 50, message = "Quiz must have between 1 and 50 questions")
        List<CreateQuestionDTO> questions,

        @NotNull(message = "Course ID is required")
        UUID courseId
) {
}
