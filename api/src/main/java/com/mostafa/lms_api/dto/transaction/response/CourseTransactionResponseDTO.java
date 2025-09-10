package com.mostafa.lms_api.dto.transaction.response;

import com.mostafa.lms_api.dto.course.CourseResponseDTO;

import java.util.List;

public record CourseTransactionResponseDTO(
        CourseResponseDTO course,

        List<SectionTransactionResponseDTO> sections
) {
}
