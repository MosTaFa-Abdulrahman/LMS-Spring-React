package com.mostafa.lms_api.service;


import com.mostafa.lms_api.dto.reply.CreateReplyDTO;
import com.mostafa.lms_api.dto.reply.ReplyResponseDTO;
import com.mostafa.lms_api.global.CustomResponseException;
import com.mostafa.lms_api.mapper.EntityDtoMapper;
import com.mostafa.lms_api.model.Comment;
import com.mostafa.lms_api.model.Reply;
import com.mostafa.lms_api.model.ReplyLike;
import com.mostafa.lms_api.model.User;
import com.mostafa.lms_api.repository.CommentRepo;
import com.mostafa.lms_api.repository.ReplyLikeRepo;
import com.mostafa.lms_api.repository.ReplyRepo;
import com.mostafa.lms_api.repository.UserRepo;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;
import java.util.UUID;


@Service
@RequiredArgsConstructor
public class ReplyService {
    private final ReplyRepo replyRepo;
    private final ReplyLikeRepo replyLikeRepo;
    private final CommentRepo commentRepo;
    private final UserRepo userRepo;
    private final EntityDtoMapper mapper;
    private final NotificationService notificationService;


    //    Create
    public ReplyResponseDTO createReply(CreateReplyDTO dto) {
        User user = userRepo.findById(dto.userId())
                .orElseThrow(() -> CustomResponseException.ResourceNotFound("User not found with this ID: " + dto.userId()));
        Comment comment = commentRepo.findById(dto.commentId())
                .orElseThrow(() -> CustomResponseException.ResourceNotFound("Comment not found with this ID: " + dto.commentId()));

        Reply reply = mapper.toReplyEntity(dto);
        reply.setUser(user);
        reply.setComment(comment);

        Reply savedReply = replyRepo.save(reply);
        notificationService.createReplyNotification(comment, savedReply, user);

        // Get likes count (0)
        Long likesCount = replyLikeRepo.countLikesByReplyId(savedReply.getId());
        // Check CurrentUser ((Liked or Not))
        boolean isLikedByCurrentUser = false;

        return mapper.toReplyResponseDTO(savedReply, likesCount, isLikedByCurrentUser);
    }

    //    Delete
    public String deleteReply(UUID replyId) {
        Reply reply = replyRepo.findById(replyId)
                .orElseThrow(() -> CustomResponseException.ResourceNotFound("Reply not found with this ID: " + replyId));

        replyRepo.delete(reply);

        return "Reply Deleted Success !!";
    }


    // ***************************** ((Specifications)) *********************** //
    // Get All Replies for Specific ((Comment))
    public Page<ReplyResponseDTO> getRepliesByCommentId(UUID commentId, int page, int size, UUID currentUserId) {
        if (commentId == null) {
            throw new IllegalArgumentException("Post ID cannot be null");
        }

        commentRepo.findById(commentId)
                .orElseThrow(() -> CustomResponseException.ResourceNotFound(
                        "Comment not found with this ID: " + commentId
                ));

        Pageable pageable = PageRequest.of(page, size);
        Page<Reply> repliesPage = replyRepo.findByCommentId(commentId, pageable);

        return repliesPage.map(reply -> {
            Long likesCount = replyLikeRepo.countLikesByReplyId(reply.getId());
            // Check CurrentUser ((Liked or Not))
            boolean isLikedByCurrentUser = currentUserId != null &&
                    replyLikeRepo.findByUserIdAndReplyId(currentUserId, reply.getId()).isPresent();

            return mapper.toReplyResponseDTO(reply, likesCount, isLikedByCurrentUser);
        });
    }


    // like/disLike Reply
    @Transactional
    public String toggleLike(UUID userId, UUID replyId) {
        User user = userRepo.findById(userId)
                .orElseThrow(() -> CustomResponseException.ResourceNotFound(
                        "User not found with this ID: " + userId));
        Reply reply = replyRepo.findById(replyId)
                .orElseThrow(() -> CustomResponseException.ResourceNotFound(
                        "Reply not found with this ID: " + replyId));

        // Check if user already liked this reply
        Optional<ReplyLike> existingLike = replyLikeRepo.findByUserIdAndReplyId(userId, replyId);

        if (existingLike.isPresent()) {
            // disLike
            replyLikeRepo.delete(existingLike.get());
            return "Reply unliked successfully";
        } else {
            // Like
            ReplyLike newLike = ReplyLike.builder()
                    .user(user)
                    .reply(reply)
                    .build();

            replyLikeRepo.save(newLike);
            notificationService.createReplyLikeNotification(reply, user);
            return "Reply liked successfully";
        }
    }


}
