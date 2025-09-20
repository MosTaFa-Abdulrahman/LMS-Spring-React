package com.mostafa.lms_api.dto.reply;

import java.time.LocalDateTime;
import java.util.UUID;

public record ReplyResponseDTO(
        UUID id,
        String text,
        LocalDateTime createdDate,
        LocalDateTime lastModifiedDate,

        // Likes
        Long likesCount,


        // User
        UUID userId,
        String userFirstName,
        String userLastName,
        String userImg,
        Boolean isLikedByCurrentUser,

        // Comment
        UUID commentId
) {
}
