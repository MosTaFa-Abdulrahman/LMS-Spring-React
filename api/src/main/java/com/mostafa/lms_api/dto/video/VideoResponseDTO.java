package com.mostafa.lms_api.dto.video;

import java.util.UUID;

public record VideoResponseDTO(
        UUID id,
        String title,
        String videoUrl,
        Boolean isPreview,
        Integer durationSeconds,
        String formattedDuration,
        Integer sortOrder
) {
}
