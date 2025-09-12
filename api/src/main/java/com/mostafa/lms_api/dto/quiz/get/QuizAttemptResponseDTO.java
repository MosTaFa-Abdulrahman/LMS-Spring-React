package com.mostafa.lms_api.dto.quiz.get;

import com.mostafa.lms_api.enums.CourseLevel;

import java.time.ZonedDateTime;
import java.util.List;
import java.util.UUID;

public record QuizAttemptResponseDTO(
        UUID id,
        Integer attemptNumber,
        ZonedDateTime startedAt,
        ZonedDateTime completedAt,
        Double totalScore,
        Boolean isCompleted,


//        Quiz
        UUID quizId,
        String quizTitle,
        String quizDescription,

//        Course
        UUID courseId,
        String courseTitle,
        String courseImg,
        CourseLevel courseLevel,


        Double totalPossiblePoints,
        List<UserAnswerResponseDTO> userAnswers
) {
}
