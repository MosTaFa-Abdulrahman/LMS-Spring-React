package com.mostafa.lms_api.dto.quiz;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.mostafa.lms_api.dto.question.UpdateQuestionDTO;
import jakarta.validation.constraints.Size;

import java.time.LocalDateTime;
import java.util.Map;
import java.util.UUID;


public record UpdateQuizDTO(
        @Size(min = 3, max = 200, message = "Title must be between 3 and 200 characters")
        String title,

        @Size(max = 1000, message = "Description cannot exceed 1000 characters")
        String description,

        @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
        LocalDateTime startTime,

        @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
        LocalDateTime endTime,


        // Map of questionId -> UpdateQuestionDTO for updating existing questions
        Map<UUID, UpdateQuestionDTO> questions
) {
}
