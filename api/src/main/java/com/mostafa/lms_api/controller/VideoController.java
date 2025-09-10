package com.mostafa.lms_api.controller;


import com.mostafa.lms_api.dto.PaginatedResponse;
import com.mostafa.lms_api.dto.video.CreateVideoDTO;
import com.mostafa.lms_api.dto.video.UpdateVideoDTO;
import com.mostafa.lms_api.dto.video.VideoResponseDTO;
import com.mostafa.lms_api.global.GlobalResponse;
import com.mostafa.lms_api.service.VideoService;
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
@RequestMapping("/api/videos")
public class VideoController {
    private final VideoService videoService;


    //    Create
    @PostMapping
    public ResponseEntity<GlobalResponse<VideoResponseDTO>> createVideo(
            @Valid @RequestBody CreateVideoDTO dto) {
        VideoResponseDTO createdVideo = videoService.createVideo(dto);
        GlobalResponse<VideoResponseDTO> res = new GlobalResponse<>(createdVideo);

        return new ResponseEntity<>(res, HttpStatus.CREATED);
    }

    //    Update
    @PutMapping("/{videoId}")
    public ResponseEntity<GlobalResponse<VideoResponseDTO>> updateVideo(
            @Valid @RequestBody UpdateVideoDTO dto,
            @PathVariable UUID videoId) {
        VideoResponseDTO updatedVideo = videoService.updateVideo(videoId, dto);
        GlobalResponse<VideoResponseDTO> res = new GlobalResponse<>(updatedVideo);

        return new ResponseEntity<>(res, HttpStatus.OK);
    }

    //    Delete
    @DeleteMapping("/{videoId}")
    public ResponseEntity<GlobalResponse<String>> deleteVideo(@PathVariable UUID videoId) {
        String deletedVideo = videoService.deleteVideo(videoId);
        GlobalResponse<String> res = new GlobalResponse<>(deletedVideo);

        return new ResponseEntity<>(res, HttpStatus.OK);
    }


    // ***************************** ((Specifications)) *********************** //
    // Get All Videos For Specific => Section
    @GetMapping("/section/{sectionId}")
    public ResponseEntity<GlobalResponse<PaginatedResponse<VideoResponseDTO>>> getAllVideos(
            @PathVariable UUID sectionId,
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "10") int size,
            HttpServletRequest req) {
        Page<VideoResponseDTO> videos = videoService.getAllVideosForSection(sectionId, page - 1, size);

        String baseUrl = req.getRequestURL().toString();
        String nextUrl = videos.hasNext() ? String.format("%s?page=%d&size=%d", baseUrl, page + 1, size) : null;
        String prevUrl = videos.hasPrevious() ? String.format("%s?page=%d&size=%d", baseUrl, page - 1, size) : null;

        var paginatedResponse = new PaginatedResponse<VideoResponseDTO>(
                videos.getContent(),
                videos.getNumber() + 1,
                videos.getTotalPages(),
                videos.getTotalElements(),
                videos.hasNext(),
                videos.hasPrevious(),
                nextUrl,
                prevUrl
        );

        return new ResponseEntity<>(new GlobalResponse<>(paginatedResponse), HttpStatus.OK);
    }


}
