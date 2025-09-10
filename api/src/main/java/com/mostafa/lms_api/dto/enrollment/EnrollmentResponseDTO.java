package com.mostafa.lms_api.dto.enrollment;

import com.mostafa.lms_api.dto.course.CourseSummaryDTO;
import com.mostafa.lms_api.enums.EnrollmentStatus;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

public record EnrollmentResponseDTO(
        UUID id,
        BigDecimal amountPaid,
        EnrollmentStatus status,
        LocalDateTime enrolledAt,
        boolean isEnrolled,


        CourseSummaryDTO course
) {
}
