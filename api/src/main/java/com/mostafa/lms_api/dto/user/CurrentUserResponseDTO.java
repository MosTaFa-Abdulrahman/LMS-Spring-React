package com.mostafa.lms_api.dto.user;

import com.mostafa.lms_api.dto.enrollment.EnrollmentResponseDTO;

import java.util.List;


public record CurrentUserResponseDTO(
        UserInfoDTO userInfo,
        List<EnrollmentResponseDTO> enrollments
) {
}
