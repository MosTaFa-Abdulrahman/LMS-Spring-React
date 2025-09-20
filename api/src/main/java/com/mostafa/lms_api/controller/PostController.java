package com.mostafa.lms_api.controller;


import com.mostafa.lms_api.dto.PaginatedResponse;
import com.mostafa.lms_api.dto.post.CreatePostDTO;
import com.mostafa.lms_api.dto.post.PostResponseDTO;
import com.mostafa.lms_api.dto.post.UpdatePostDTO;
import com.mostafa.lms_api.global.GlobalResponse;
import com.mostafa.lms_api.service.PostService;
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
@RequestMapping("/api/posts")
public class PostController {
    private final PostService postService;
    private final CurrentUser currentUser;


    //    Create
    @PostMapping
    public ResponseEntity<GlobalResponse<PostResponseDTO>> createPost(
            @Valid @RequestBody CreatePostDTO dto) {
        PostResponseDTO createdPost = postService.createPost(dto);
        GlobalResponse<PostResponseDTO> res = new GlobalResponse<>(createdPost);

        return new ResponseEntity<>(res, HttpStatus.CREATED);
    }

    //    Update
    @PutMapping("/{postId}")
    public ResponseEntity<GlobalResponse<PostResponseDTO>> updatePost(
            @PathVariable UUID postId,
            @Valid @RequestBody UpdatePostDTO dto) {
        UUID currentUserId = currentUser.getCurrentUserId();

        PostResponseDTO updatedPost = postService.updatePost(postId, dto, currentUserId);
        GlobalResponse<PostResponseDTO> res = new GlobalResponse<>(updatedPost);

        return new ResponseEntity<>(res, HttpStatus.OK);
    }

    //    Delete
    @DeleteMapping("/{postId}")
    public ResponseEntity<GlobalResponse<String>> deletePost(@PathVariable UUID postId) {
        String deletePost = postService.deletePost(postId);
        GlobalResponse<String> res = new GlobalResponse<>(deletePost);

        return new ResponseEntity<>(res, HttpStatus.OK);
    }

    //    Get Single
    @GetMapping("/{postId}")
    public ResponseEntity<GlobalResponse<PostResponseDTO>> getByPostId(@PathVariable UUID postId) {
        UUID currentUserId = currentUser.getCurrentUserId();
        PostResponseDTO post = postService.getPost(postId, currentUserId);
        GlobalResponse<PostResponseDTO> res = new GlobalResponse<>(post);

        return new ResponseEntity<>(res, HttpStatus.OK);
    }

    //    Get All
    @GetMapping
    public ResponseEntity<GlobalResponse<PaginatedResponse<PostResponseDTO>>> getAll(
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "10") int size,
            HttpServletRequest req
    ) {
        UUID currentUserId = currentUser.getCurrentUserId();
        Page<PostResponseDTO> posts = postService.getAllPosts(page - 1, size, currentUserId);

        String baseUrl = req.getRequestURL().toString();
        String nextUrl = posts.hasNext() ? String.format("%s?page=%d&size=%d", baseUrl, page + 1, size) : null;
        String prevUrl = posts.hasPrevious() ? String.format("%s?page=%d&size=%d", baseUrl, page - 1, size) : null;

        var paginatedResponse = new PaginatedResponse<PostResponseDTO>(
                posts.getContent(),
                posts.getNumber() + 1,
                posts.getTotalPages(),
                posts.getTotalElements(),
                posts.hasNext(),
                posts.hasPrevious(),
                nextUrl,
                prevUrl
        );

        return new ResponseEntity<>(new GlobalResponse<>(paginatedResponse), HttpStatus.OK);
    }

    //    Get All For ((Specific-User))
    @GetMapping("/user/{userId}")
    public ResponseEntity<GlobalResponse<PaginatedResponse<PostResponseDTO>>> getAllForUser(
            @PathVariable UUID userId,
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "10") int size,
            HttpServletRequest req
    ) {
        UUID currentUserId = currentUser.getCurrentUserId();
        Page<PostResponseDTO> posts = postService.getAllPostsForUser(userId, page - 1, size, currentUserId);

        String baseUrl = req.getRequestURL().toString();
        String nextUrl = posts.hasNext() ? String.format("%s?page=%d&size=%d", baseUrl, page + 1, size) : null;
        String prevUrl = posts.hasPrevious() ? String.format("%s?page=%d&size=%d", baseUrl, page - 1, size) : null;

        var paginatedResponse = new PaginatedResponse<PostResponseDTO>(
                posts.getContent(),
                posts.getNumber() + 1,
                posts.getTotalPages(),
                posts.getTotalElements(),
                posts.hasNext(),
                posts.hasPrevious(),
                nextUrl,
                prevUrl
        );

        return new ResponseEntity<>(new GlobalResponse<>(paginatedResponse), HttpStatus.OK);
    }


    //    ************************ ((Specifications)) ******************************** //
    // Like/disLike Post
    @PostMapping("/{postId}/like")
    public ResponseEntity<GlobalResponse<String>> toggleLike(@PathVariable UUID postId) {
        // Get currentUser and check Authenticated
        UUID currentUserId = currentUser.getCurrentUserId();
        if (currentUserId == null) {
            return new ResponseEntity<>(
                    new GlobalResponse<>("User not authenticated"),
                    HttpStatus.UNAUTHORIZED
            );
        }

        String response = postService.toggleLike(currentUserId, postId);
        GlobalResponse<String> res = new GlobalResponse<>(response);

        return new ResponseEntity<>(res, HttpStatus.OK);
    }


}
