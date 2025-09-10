package com.mostafa.lms_api.dto.user;

import com.mostafa.lms_api.enums.UserLevel;
import com.mostafa.lms_api.enums.UserRole;

import java.util.UUID;

public record UserResponseDTO(
        UUID id,
        String username,
        String email,
        String firstName,
        String lastName,
        String phoneNumber,
        String fatherPhoneNumber,
        String profileImageUrl,
        UserLevel level,
        UserRole role
) {
}
