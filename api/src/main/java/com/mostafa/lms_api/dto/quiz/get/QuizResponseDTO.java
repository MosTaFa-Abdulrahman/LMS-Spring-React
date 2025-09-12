package com.mostafa.lms_api.dto.quiz.get;

import com.mostafa.lms_api.enums.CourseLevel;

import java.time.ZonedDateTime;
import java.util.List;
import java.util.UUID;

public record QuizResponseDTO(
        UUID id,
        String title,
        String description,
        ZonedDateTime startTime,
        ZonedDateTime endTime,
        Integer maxAttempts,


//        User
        UUID userId,
        String userFirstName,
        String userLastName,
        String userImg,

//        Course
        UUID courseId,
        String courseTitle,
        String courseImg,
        CourseLevel courseLevel,


        List<QuestionResponseDTO> questions
) {
}
