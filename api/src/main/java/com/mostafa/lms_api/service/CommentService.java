package com.mostafa.lms_api.service;


import com.mostafa.lms_api.dto.comment.CommentResponseDTO;
import com.mostafa.lms_api.dto.comment.CreateCommentDTO;
import com.mostafa.lms_api.global.CustomResponseException;
import com.mostafa.lms_api.mapper.EntityDtoMapper;
import com.mostafa.lms_api.model.Comment;
import com.mostafa.lms_api.model.CommentLike;
import com.mostafa.lms_api.model.Post;
import com.mostafa.lms_api.model.User;
import com.mostafa.lms_api.repository.CommentLikeRepo;
import com.mostafa.lms_api.repository.CommentRepo;
import com.mostafa.lms_api.repository.PostRepo;
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
public class CommentService {
    private final CommentRepo commentRepo;
    private final CommentLikeRepo commentLikeRepo;
    private final UserRepo userRepo;
    private final PostRepo postRepo;
    private final EntityDtoMapper mapper;
    private final NotificationService notificationService;


    //    Create
    public CommentResponseDTO createComment(CreateCommentDTO dto) {
        User user = userRepo.findById(dto.userId())
                .orElseThrow(() -> CustomResponseException.ResourceNotFound("User not found with this ID: " + dto.userId()));
        Post post = postRepo.findById(dto.postId())
                .orElseThrow(() -> CustomResponseException.ResourceNotFound("Post not found with this ID: " + dto.postId()));

        Comment comment = mapper.toCommentEntity(dto);
        comment.setUser(user);
        comment.setPost(post);

        Comment savedComment = commentRepo.save(comment);
        notificationService.createCommentNotification(post, savedComment, user);


        // Get likes count
        Long likesCount = commentLikeRepo.countLikesByCommentId(savedComment.getId());
        // Check CurrentUser ((Liked or Not))
        boolean isLikedByCurrentUser = false;

        return mapper.toCommentResponseDTO(savedComment, likesCount, isLikedByCurrentUser);
    }

    //    Get Single Comment For Test (Response)
    public CommentResponseDTO getByCommentId(UUID commentId, UUID currentUserId) {
        Comment comment = commentRepo.findById(commentId)
                .orElseThrow(() -> CustomResponseException.ResourceNotFound("Comment not found with this ID: " + commentId));

        // Get likes count
        Long likesCount = commentLikeRepo.countLikesByCommentId(comment.getId());
        // Check CurrentUser ((Liked or Not))
        boolean isLikedByCurrentUser = currentUserId != null &&
                commentLikeRepo.findByUserIdAndCommentId(currentUserId, comment.getId()).isPresent();

        return mapper.toCommentResponseDTO(comment, likesCount, isLikedByCurrentUser);
    }

    //    Delete
    public String deleteComment(UUID commentId) {
        Comment comment = commentRepo.findById(commentId)
                .orElseThrow(() -> CustomResponseException.ResourceNotFound("Comment not found with this ID: " + commentId));

        commentRepo.delete(comment);

        return "Comment Deleted Success!!";
    }

    // ***************************** ((Specifications)) *********************** //
    // Get All Comments for Specific ((Post))
    public Page<CommentResponseDTO> getCommentsByPostId(UUID postId, int page, int size, UUID currentUserId) {
        if (postId == null) {
            throw new IllegalArgumentException("Post ID cannot be null");
        }

        postRepo.findById(postId)
                .orElseThrow(() -> CustomResponseException.ResourceNotFound(
                        "Post not found with this ID: " + postId
                ));

        Pageable pageable = PageRequest.of(page, size);
        Page<Comment> commentsPage = commentRepo.findByPostId(postId, pageable);

        return commentsPage.map(comment -> {
            Long likesCount = commentLikeRepo.countLikesByCommentId(comment.getId());
            // Check CurrentUser ((Liked or Not))
            boolean isLikedByCurrentUser = currentUserId != null &&
                    commentLikeRepo.findByUserIdAndCommentId(currentUserId, comment.getId()).isPresent();

            return mapper.toCommentResponseDTO(comment, likesCount, isLikedByCurrentUser);
        });
    }

    // like/disLike Comment
    @Transactional
    public String toggleLike(UUID userId, UUID commentId) {
        User user = userRepo.findById(userId)
                .orElseThrow(() -> CustomResponseException.ResourceNotFound(
                        "User not found with this ID: " + userId));
        Comment comment = commentRepo.findById(commentId)
                .orElseThrow(() -> CustomResponseException.ResourceNotFound(
                        "Comment not found with this ID: " + commentId));

        // Check if user already liked this comment
        Optional<CommentLike> existingLike = commentLikeRepo.findByUserIdAndCommentId(userId, commentId);

        if (existingLike.isPresent()) {
            // disLike
            commentLikeRepo.delete(existingLike.get());
            return "Comment unliked successfully";
        } else {
            // Like
            CommentLike newLike = CommentLike.builder()
                    .user(user)
                    .comment(comment)
                    .build();

            commentLikeRepo.save(newLike);
            notificationService.createCommentLikeNotification(comment, user);
            return "Comment liked successfully";
        }
    }


}
