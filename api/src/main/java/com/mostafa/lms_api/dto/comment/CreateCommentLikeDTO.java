package com.mostafa.lms_api.dto.comment;

import jakarta.validation.constraints.NotBlank;

public record CreateCommentLikeDTO(
        @NotBlank(message = "User ID is required")
        String userId,

        @NotBlank(message = "Comment ID is required")
        String commentId
) {
}
