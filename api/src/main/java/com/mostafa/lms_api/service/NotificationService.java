package com.mostafa.lms_api.service;

import com.mostafa.lms_api.dto.notification.NotificationDTO;
import com.mostafa.lms_api.enums.NotificationType;
import com.mostafa.lms_api.global.CustomResponseException;
import com.mostafa.lms_api.mapper.EntityDtoMapper;
import com.mostafa.lms_api.model.*;
import com.mostafa.lms_api.repository.NotificationRepo;
import com.mostafa.lms_api.utils.CurrentUser;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Service
@RequiredArgsConstructor
public class NotificationService {
    private final NotificationRepo notificationRepo;
    private final CurrentUser currentUser;
    private final EntityDtoMapper mapper;


    // Helper method to convert to DTO
    private NotificationDTO convertToDTO(Notification notification) {
        return mapper.toNotificationDTO(notification);
    }

    // Save and send real-time notification
    private void saveAndSendNotification(Notification notification) {
        Notification savedNotification = notificationRepo.save(notification);

        // Send real-time notification via WebSocket
        NotificationDTO dto = convertToDTO(savedNotification);


    }


    // Create notification for post like
    public void createPostLikeNotification(Post post, User triggerUser) {
        if (post.getUser().getId().equals(triggerUser.getId())) {
            return; // Don't notify yourself
        }

        Notification notification = Notification.builder()
                .title("New Like")
                .message(triggerUser.getUsername() + " " + NotificationType.POST_LIKE.getMessage())
                .type(NotificationType.POST_LIKE)
                .referenceId(post.getId())
                .user(post.getUser())
                .triggeredByUser(triggerUser)
                .build();

        saveAndSendNotification(notification);
    }

    // Create notification for comment like
    public void createCommentLikeNotification(Comment comment, User triggerUser) {
        if (comment.getUser().getId().equals(triggerUser.getId())) {
            return; // Don't notify yourself
        }

        Notification notification = Notification.builder()
                .title("New Like")
                .message(triggerUser.getUsername() + " " + NotificationType.COMMENT_LIKE.getMessage())
                .type(NotificationType.COMMENT_LIKE)
                .referenceId(comment.getId())
                .user(comment.getUser())
                .triggeredByUser(triggerUser)
                .build();

        saveAndSendNotification(notification);
    }

    // Create notification for reply like
    public void createReplyLikeNotification(Reply reply, User triggerUser) {
        if (reply.getUser().getId().equals(triggerUser.getId())) {
            return; // Don't notify yourself
        }

        Notification notification = Notification.builder()
                .title("New Like")
                .message(triggerUser.getUsername() + " " + NotificationType.REPLY_LIKE.getMessage())
                .type(NotificationType.REPLY_LIKE)
                .referenceId(reply.getId())
                .user(reply.getUser())
                .triggeredByUser(triggerUser)
                .build();

        saveAndSendNotification(notification);
    }

    // Create notification for new comment
    public void createCommentNotification(Post post, Comment comment, User triggerUser) {
        if (post.getUser().getId().equals(triggerUser.getId())) {
            return; // Don't notify yourself
        }

        Notification notification = Notification.builder()
                .title("New Comment")
                .message(triggerUser.getUsername() + " " + NotificationType.POST_COMMENT.getMessage())
                .type(NotificationType.POST_COMMENT)
                .referenceId(comment.getId())
                .user(post.getUser())
                .triggeredByUser(triggerUser)
                .build();

        saveAndSendNotification(notification);
    }

    // Create notification for new reply
    public void createReplyNotification(Comment comment, Reply reply, User triggerUser) {
        if (comment.getUser().getId().equals(triggerUser.getId())) {
            return; // Don't notify yourself
        }

        Notification notification = Notification.builder()
                .title("New Reply")
                .message(triggerUser.getUsername() + " " + NotificationType.COMMENT_REPLY.getMessage())
                .type(NotificationType.COMMENT_REPLY)
                .referenceId(reply.getId())
                .user(comment.getUser())
                .triggeredByUser(triggerUser)
                .build();

        saveAndSendNotification(notification);
    }

    // Create notification for new follower
    public void createFollowNotification(User followedUser, User followerUser) {
        Notification notification = Notification.builder()
                .title("New Follower")
                .message(followerUser.getUsername() + " " + NotificationType.USER_FOLLOW.getMessage())
                .type(NotificationType.USER_FOLLOW)
                .referenceId(followerUser.getId())
                .user(followedUser)
                .triggeredByUser(followerUser)
                .build();

        saveAndSendNotification(notification);
    }


    //    ******************************** ((Specifications)) *********************************** //
    // Get paginated notifications for user
    public Page<NotificationDTO> getUserNotifications(UUID userId, int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<Notification> notifications = notificationRepo.findByUserIdOrderByCreatedDateDesc(userId, pageable);


        return notifications.map(mapper::toNotificationDTO);
    }

    //    Delete
    public String deleteNotification(UUID notificationId) {
        Notification notification = notificationRepo.findById(notificationId)
                .orElseThrow(() -> CustomResponseException.ResourceNotFound("Notification not found with this ID: " + notificationId));

        notificationRepo.delete(notification);

        return "Notification Deleted Success!!";
    }

    // Get unread notifications count
    public long getUnreadCount(UUID userId) {
        return notificationRepo.countByUserIdAndIsReadFalse(userId);
    }

    // Mark notification as read
    @Transactional
    public void markAsRead(UUID notificationId) {
        UUID userId = currentUser.getCurrentUserId();
        if (userId != null) {
            notificationRepo.markAsReadByIdAndUserId(notificationId, userId);
        }
    }

    // Mark all notifications as read
    @Transactional
    public void markAllAsRead() {
        UUID userId = currentUser.getCurrentUserId();
        if (userId != null) {
            notificationRepo.markAllAsReadByUserId(userId);
        }
    }

}
