package com.mostafa.lms_api.dto.course;

import com.mostafa.lms_api.dto.section.SectionSummaryDTO;
import com.mostafa.lms_api.enums.CourseLevel;

import java.util.List;
import java.util.UUID;

public record CourseSummaryDTO(
        UUID id,
        String title,
        String courseImg,
        CourseLevel level,

        List<SectionSummaryDTO> sections
) {
}
