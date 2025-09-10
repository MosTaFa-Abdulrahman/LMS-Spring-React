package com.mostafa.lms_api.dto.course;

import com.mostafa.lms_api.enums.CourseLevel;
import com.mostafa.lms_api.enums.CourseStatus;

import java.math.BigDecimal;
import java.util.UUID;

public record CourseResponseDTO(
        UUID id,
        String title,
        String description,
        String shortDescription,
        String courseImg,
        BigDecimal price,
        Double estimatedDurationHours,
        Boolean isPublished,
        CourseStatus status,
        CourseLevel level,


        //  User
        UUID userId,
        String profileImageUrl,
        String userFirstName,
        String userLastName
) {
}
