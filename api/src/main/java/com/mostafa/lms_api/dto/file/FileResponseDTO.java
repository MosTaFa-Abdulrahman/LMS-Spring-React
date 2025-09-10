package com.mostafa.lms_api.dto.file;

import java.util.UUID;

public record FileResponseDTO(
        UUID id,
        String title,
        String fileUrl,
        Boolean isPreview
) {
}
