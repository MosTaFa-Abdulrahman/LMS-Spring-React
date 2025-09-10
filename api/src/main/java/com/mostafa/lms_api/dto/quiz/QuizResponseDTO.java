package com.mostafa.lms_api.dto.quiz;

import com.mostafa.lms_api.dto.question.QuestionResponseDTO;
import com.mostafa.lms_api.enums.CourseLevel;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

public record QuizResponseDTO(
        UUID id,
        String title,
        String description,
        LocalDateTime startTime,
        LocalDateTime endTime,
        Double totalScore,
        Double userScore,

//        User
        UUID userId,
        String userFirstName,
        String userLastName,

//        Course
        UUID courseId,
        String courseImg,
        CourseLevel courseLevel,


        List<QuestionResponseDTO> questions,
        boolean isCompleted
) {
}
