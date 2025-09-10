package com.mostafa.lms_api.dto.section;

import java.math.BigDecimal;
import java.util.UUID;

public record SectionResponseDTO(
        UUID id,
        String title,
        String description,
        Boolean isPublished,
        BigDecimal price,
        Integer sortOrder,


        String duration
) {
}
