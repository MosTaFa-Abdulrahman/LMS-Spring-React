package com.mostafa.lms_api.dto.user;

import com.mostafa.lms_api.enums.UserLevel;
import com.mostafa.lms_api.enums.UserRole;

import java.util.UUID;

public record UserInfoDTO(
        UUID id,
        String username,
        String email,
        String firstName,
        String lastName,
        String phoneNumber,
        String fatherPhoneNumber,
        String profileImageUrl,
        UserLevel userLevel,
        UserRole role
) {
}
