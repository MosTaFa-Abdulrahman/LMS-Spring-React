package com.mostafa.lms_api.dto.transaction.request;

import com.mostafa.lms_api.enums.CourseLevel;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import org.hibernate.validator.constraints.URL;

import java.util.List;

public record CreateCourseTransaction(
        // Course fields
        @NotBlank(message = "Course title is required")
        @Size(min = 3, max = 1500, message = "Course title must be between 3 and 1500 characters")
        String title,

        @Size(max = 9000, message = "Description cannot exceed 9000 characters")
        String description,

        @Size(max = 3000, message = "Short description cannot exceed 3000 characters")
        String shortDescription,

        @URL(message = "Course image must be a valid URL")
        String courseImg,

        @NotNull(message = "Course Level is required")
        CourseLevel level,

        // Sections with their content
        @NotEmpty(message = "At least one section is required")
        @Valid
        List<CreateSectionTransaction> sections
) {
}
