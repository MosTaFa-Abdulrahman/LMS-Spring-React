package com.mostafa.lms_api.dto.comment;

import java.time.LocalDateTime;
import java.util.UUID;

public record CommentResponseDTO(
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

        // Post
        UUID postId,
        String postText
) {
}
