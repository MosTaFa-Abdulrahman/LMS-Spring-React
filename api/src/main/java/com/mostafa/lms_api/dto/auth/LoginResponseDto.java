package com.mostafa.lms_api.dto.auth;

import java.util.UUID;

public record LoginResponseDto(
        String token,
        UUID userId,
        String username,
        String email
) {
}
