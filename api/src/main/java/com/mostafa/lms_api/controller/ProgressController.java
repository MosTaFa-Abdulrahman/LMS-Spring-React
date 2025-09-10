package com.mostafa.lms_api.controller;

import com.mostafa.lms_api.dto.PaginatedResponse;
import com.mostafa.lms_api.dto.progress.ProgressResponseDTO;
import com.mostafa.lms_api.dto.progress.UpdateProgressDTO;
import com.mostafa.lms_api.global.GlobalResponse;
import com.mostafa.lms_api.service.ProgressService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/progress")
public class ProgressController {
    private final ProgressService progressService;


    // ***************************** CORE PROGRESS TRACKING ***************************** //

    // Update video progress
    @PutMapping("/videos/{videoId}")
//    @PreAuthorize("hasRole('USER') or hasRole('INSTRUCTOR')")
    public ResponseEntity<GlobalResponse<ProgressResponseDTO>> updateProgress(
            @PathVariable UUID videoId,
            @Valid @RequestBody UpdateProgressDTO dto) {

        ProgressResponseDTO updatedProgress = progressService.updateProgress(videoId, dto);
        return new ResponseEntity<>(new GlobalResponse<>(updatedProgress), HttpStatus.OK);
    }

    // Get progress for a specific video
    @GetMapping("/videos/{videoId}")
//    @PreAuthorize("hasRole('USER') or hasRole('INSTRUCTOR')")
    public ResponseEntity<GlobalResponse<ProgressResponseDTO>> getVideoProgress(
            @PathVariable UUID videoId) {

        ProgressResponseDTO progress = progressService.getProgress(videoId);
        return new ResponseEntity<>(new GlobalResponse<>(progress), HttpStatus.OK);
    }


    // ***************************** COURSE PROGRESS ***************************** //
    // Get all videos progress for a course
    @GetMapping("/courses/{courseId}")
//    @PreAuthorize("hasRole('USER') or hasRole('INSTRUCTOR')")
    public ResponseEntity<GlobalResponse<List<ProgressResponseDTO>>> getCourseProgress(
            @PathVariable UUID courseId) {

        List<ProgressResponseDTO> progressList = progressService.getCourseProgress(courseId);
        return new ResponseEntity<>(new GlobalResponse<>(progressList), HttpStatus.OK);
    }


    // ***************************** USER PROGRESS ***************************** //

    // Get paginated progress for current user
    @GetMapping("/my-progress")
//    @PreAuthorize("hasRole('USER') or hasRole('INSTRUCTOR')")
    public ResponseEntity<GlobalResponse<PaginatedResponse<ProgressResponseDTO>>> getAllUserProgress(
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "10") int size,
            HttpServletRequest req) {

        Page<ProgressResponseDTO> progressPage = progressService.getAllUserProgress(page - 1, size);

        String baseUrl = req.getRequestURL().toString();
        String nextUrl = progressPage.hasNext() ? String.format("%s?page=%d&size=%d", baseUrl, page + 1, size) : null;
        String prevUrl = progressPage.hasPrevious() ? String.format("%s?page=%d&size=%d", baseUrl, page - 1, size) : null;

        var paginatedResponse = new PaginatedResponse<>(
                progressPage.getContent(),
                progressPage.getNumber() + 1,
                progressPage.getTotalPages(),
                progressPage.getTotalElements(),
                progressPage.hasNext(),
                progressPage.hasPrevious(),
                nextUrl,
                prevUrl
        );

        return new ResponseEntity<>(new GlobalResponse<>(paginatedResponse), HttpStatus.OK);
    }


    // ***************************** COMPLETE VIDEO ***************************** //

    // Mark video as completed
    @PatchMapping("/videos/{videoId}/complete")
//    @PreAuthorize("hasRole('USER') or hasRole('INSTRUCTOR')")
    public ResponseEntity<GlobalResponse<ProgressResponseDTO>> markVideoCompleted(
            @PathVariable UUID videoId) {

        ProgressResponseDTO completedProgress = progressService.markVideoCompleted(videoId);
        return new ResponseEntity<>(new GlobalResponse<>(completedProgress), HttpStatus.OK);
    }


    // ***************************** INSTRUCTOR ANALYTICS ***************************** //

    // Get course progress analytics
    @GetMapping("/courses/{courseId}/analytics")
//    @PreAuthorize("hasRole('INSTRUCTOR')")
    public ResponseEntity<GlobalResponse<PaginatedResponse<ProgressResponseDTO>>> getCourseAnalytics(
            @PathVariable UUID courseId,
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "20") int size,
            HttpServletRequest req) {

        Page<ProgressResponseDTO> analyticsPage = progressService.getCourseProgressAnalytics(courseId, page - 1, size);

        String baseUrl = req.getRequestURL().toString();
        String nextUrl = analyticsPage.hasNext() ? String.format("%s?page=%d&size=%d", baseUrl, page + 1, size) : null;
        String prevUrl = analyticsPage.hasPrevious() ? String.format("%s?page=%d&size=%d", baseUrl, page - 1, size) : null;

        var paginatedResponse = new PaginatedResponse<>(
                analyticsPage.getContent(),
                analyticsPage.getNumber() + 1,
                analyticsPage.getTotalPages(),
                analyticsPage.getTotalElements(),
                analyticsPage.hasNext(),
                analyticsPage.hasPrevious(),
                nextUrl,
                prevUrl
        );

        return new ResponseEntity<>(new GlobalResponse<>(paginatedResponse), HttpStatus.OK);
    }

    // Get completed users for a course
    @GetMapping("/courses/{courseId}/completed-users")
//    @PreAuthorize("hasRole('INSTRUCTOR')")
    public ResponseEntity<GlobalResponse<List<UUID>>> getCompletedUsers(
            @PathVariable UUID courseId) {

        List<UUID> completedUsers = progressService.getCompletedUsers(courseId);
        return new ResponseEntity<>(new GlobalResponse<>(completedUsers), HttpStatus.OK);
    }

}
