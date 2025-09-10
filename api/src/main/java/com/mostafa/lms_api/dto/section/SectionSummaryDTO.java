package com.mostafa.lms_api.dto.section;

import java.math.BigDecimal;
import java.util.UUID;

public record SectionSummaryDTO(
        UUID id,
        String title,
        BigDecimal price,
        Integer sortOrder

) {
}
