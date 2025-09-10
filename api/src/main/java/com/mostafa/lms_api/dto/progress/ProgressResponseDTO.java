package com.mostafa.lms_api.dto.progress;

import java.time.LocalDateTime;
import java.util.UUID;

public record ProgressResponseDTO(
        UUID id,
        Integer watchDurationSeconds,
        Double completionPercentage,
        Boolean isCompleted,
        LocalDateTime lastWatchedAt,


        // User
        UUID userId,
        String username,
        String userFirstName,
        String userLastName,
        String userEmail,

        // Course
        UUID courseId,
        String courseTitle,
        String courseShortDescription,
        String courseImg,
        Double courseEstimatedDurationHours,

        // Video
        UUID videoId,
        String videoTitle,
        Integer videoDurationSeconds,
        Integer videoSortOrder,
        Boolean videoIsPreview

) {
}
