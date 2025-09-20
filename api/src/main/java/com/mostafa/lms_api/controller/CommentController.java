package com.mostafa.lms_api.controller;


import com.mostafa.lms_api.dto.PaginatedResponse;
import com.mostafa.lms_api.dto.comment.CommentResponseDTO;
import com.mostafa.lms_api.dto.comment.CreateCommentDTO;
import com.mostafa.lms_api.global.GlobalResponse;
import com.mostafa.lms_api.service.CommentService;
import com.mostafa.lms_api.utils.CurrentUser;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;


@RestController
@RequiredArgsConstructor
@RequestMapping("/api/comments")
public class CommentController {
    private final CommentService commentService;
    private final CurrentUser currentUser;


    //    Create
    @PostMapping
    public ResponseEntity<GlobalResponse<CommentResponseDTO>> createComment(
            @Valid @RequestBody CreateCommentDTO dto) {
        CommentResponseDTO createdComment = commentService.createComment(dto);
        GlobalResponse<CommentResponseDTO> res = new GlobalResponse<>(createdComment);

        return new ResponseEntity<>(res, HttpStatus.CREATED);
    }

    //    Get Single
    @GetMapping("/{commentId}")
    public ResponseEntity<GlobalResponse<CommentResponseDTO>> getByPostId(@PathVariable UUID commentId) {
        UUID currentUserId = currentUser.getCurrentUserId();
        CommentResponseDTO comment = commentService.getByCommentId(commentId, currentUserId);
        GlobalResponse<CommentResponseDTO> res = new GlobalResponse<>(comment);

        return new ResponseEntity<>(res, HttpStatus.OK);
    }

    //    Delete
    @DeleteMapping("/{commentId}")
    public ResponseEntity<GlobalResponse<String>> deleteComment(@PathVariable UUID commentId) {
        String deleteComment = commentService.deleteComment(commentId);
        GlobalResponse<String> res = new GlobalResponse<>(deleteComment);

        return new ResponseEntity<>(res, HttpStatus.OK);
    }


    //    ************************ ((Specifications)) ******************************** //
    // Get All Comments For Specific => POST (Paginated)
    @GetMapping("/post/{postId}")
    public ResponseEntity<GlobalResponse<PaginatedResponse<CommentResponseDTO>>> getAllComments(
            @PathVariable UUID postId,
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "10") int size,
            HttpServletRequest req) {
        UUID currentUserId = currentUser.getCurrentUserId();
        Page<CommentResponseDTO> comments = commentService.getCommentsByPostId(postId, page - 1, size, currentUserId);

        String baseUrl = req.getRequestURL().toString();
        String nextUrl = comments.hasNext() ? String.format("%s?page=%d&size=%d", baseUrl, page + 1, size) : null;
        String prevUrl = comments.hasPrevious() ? String.format("%s?page=%d&size=%d", baseUrl, page - 1, size) : null;

        var paginatedResponse = new PaginatedResponse<CommentResponseDTO>(
                comments.getContent(),
                comments.getNumber() + 1,
                comments.getTotalPages(),
                comments.getTotalElements(),
                comments.hasNext(),
                comments.hasPrevious(),
                nextUrl,
                prevUrl
        );

        return new ResponseEntity<>(new GlobalResponse<>(paginatedResponse), HttpStatus.OK);
    }


    //    ************************ ((Specifications)) ******************************** //
    // Like/disLike Comment
    @PostMapping("/{commentId}/like")
    public ResponseEntity<GlobalResponse<String>> toggleLike(@PathVariable UUID commentId) {
        UUID currentUserId = currentUser.getCurrentUserId();
        if (currentUserId == null) {
            return new ResponseEntity<>(
                    new GlobalResponse<>("User not authenticated"),
                    HttpStatus.UNAUTHORIZED
            );
        }

        String response = commentService.toggleLike(currentUserId, commentId);
        GlobalResponse<String> res = new GlobalResponse<>(response);

        return new ResponseEntity<>(res, HttpStatus.OK);
    }


}
