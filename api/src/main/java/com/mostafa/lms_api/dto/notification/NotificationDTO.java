package com.mostafa.lms_api.dto.notification;

import com.mostafa.lms_api.enums.NotificationType;

import java.time.LocalDateTime;
import java.util.UUID;

public record NotificationDTO(
        UUID id,
        String title,
        String message,
        Boolean isRead,
        NotificationType type,
        LocalDateTime createdDate,
        UUID referenceId,


        // User
        UUID userId,
        String userFirstName,
        String userLastName,
        String userEmail,
        String userImgUrl
) {
}
