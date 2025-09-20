package com.mostafa.lms_api.enums;


import lombok.Getter;

@Getter
public enum NotificationType {
    POST_LIKE("liked your post"),
    COMMENT_LIKE("liked your comment"),
    REPLY_LIKE("liked your reply"),
    POST_COMMENT("commented on your post"),
    COMMENT_REPLY("replied to your comment"),
    USER_FOLLOW("started following you");

    private final String message;

    NotificationType(String message) {
        this.message = message;
    }

    public String getMessage() {
        return message;
    }
}