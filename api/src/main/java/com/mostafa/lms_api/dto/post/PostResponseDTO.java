package com.mostafa.lms_api.dto.post;

import java.time.LocalDateTime;
import java.util.UUID;

public record PostResponseDTO(
        UUID id,
        String text,
        String imageUrl,
        LocalDateTime createdDate,
        LocalDateTime lastModifiedDate,


        // Likes
        Long likesCount,

        // User
        UUID userId,
        String userFirstName,
        String userLastName,
        String userImg,
        Boolean isLikedByCurrentUser
) {
}
