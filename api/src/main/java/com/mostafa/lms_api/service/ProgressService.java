package com.mostafa.lms_api.service;


import com.mostafa.lms_api.dto.progress.ProgressResponseDTO;
import com.mostafa.lms_api.dto.progress.UpdateProgressDTO;
import com.mostafa.lms_api.global.CustomResponseException;
import com.mostafa.lms_api.mapper.EntityDtoMapper;
import com.mostafa.lms_api.model.Course;
import com.mostafa.lms_api.model.Progress;
import com.mostafa.lms_api.model.User;
import com.mostafa.lms_api.model.Video;
import com.mostafa.lms_api.repository.CourseRepo;
import com.mostafa.lms_api.repository.ProgressRepo;
import com.mostafa.lms_api.repository.VideoRepo;
import com.mostafa.lms_api.utils.CurrentUser;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;


@Service
@RequiredArgsConstructor
@Transactional
@Slf4j
public class ProgressService {
    private final ProgressRepo progressRepo;
    private final VideoRepo videoRepo;
    private final CourseRepo courseRepo;
    private final EntityDtoMapper mapper;
    private final CurrentUser currentUser;


    // ***************************** CORE PROGRESS TRACKING ***************************** //
    //    Helper (1) for -> updateProgress
    private Progress createNewProgress(User user, Course course, Video video) {
        return Progress.builder()
                .user(user)
                .course(course)
                .video(video)
                .watchDurationSeconds(0)
                .completionPercentage(0.0)
                .isCompleted(false)
                .build();
    }

    //    Helper (2) for -> updateProgress
    private void updateProgressFields(Progress progress, UpdateProgressDTO dto, Video video) {
        // Update watch duration
        if (dto.watchDurationSeconds() != null) {
            progress.setWatchDurationSeconds(Math.max(0, dto.watchDurationSeconds()));
        }

        // Update last watched timestamp
        progress.setLastWatchedAt(LocalDateTime.now());

        // Calculate completion percentage automatically
        if (video.getDurationSeconds() != null && video.getDurationSeconds() > 0) {
            double percentage = Math.min(100.0,
                    (double) progress.getWatchDurationSeconds() / video.getDurationSeconds() * 100);
            progress.setCompletionPercentage(Math.round(percentage * 100.0) / 100.0); // Round to 2 decimal places

            // Mark as completed if watched 90% or more
            progress.setIsCompleted(percentage >= 90.0);
        }
    }

    /**
     * Update or create progress for a video
     * Automatically calculates completion percentage and completion status
     */
    public ProgressResponseDTO updateProgress(UUID videoId, UpdateProgressDTO dto) {
        User authUser = currentUser.getCurrentUser();

        // Get video and validate
        Video video = videoRepo.findById(videoId)
                .orElseThrow(() -> CustomResponseException.ResourceNotFound("Video not found with ID: " + videoId));

        Course course = video.getSection().getCourse();

        // Find existing progress or create new one
        Progress progress = progressRepo.findByUserIdAndCourseIdAndVideoId(
                authUser.getId(), course.getId(), videoId
        ).orElseGet(() -> createNewProgress(authUser, course, video));

        // Update progress with automatic calculations
        updateProgressFields(progress, dto, video);

        Progress savedProgress = progressRepo.save(progress);
        log.info("Progress updated for user: {}, video: {}, completion: {}%",
                authUser.getId(), videoId, savedProgress.getCompletionPercentage());

        return mapper.toProgressResponseDTO(savedProgress);
    }


    // ***************************** PROGRESS RETRIEVAL ***************************** //

    /**
     * Get specific progress for (currentUser + Video)
     */
    public ProgressResponseDTO getProgress(UUID videoId) {
        User authUser = currentUser.getCurrentUser();

        Video video = videoRepo.findById(videoId)
                .orElseThrow(() -> CustomResponseException.ResourceNotFound("Video not found with ID: " + videoId));

        Course course = video.getSection().getCourse();

        Progress progress = progressRepo.findByUserIdAndCourseIdAndVideoId(
                authUser.getId(), course.getId(), videoId
        ).orElseThrow(() -> CustomResponseException.ResourceNotFound(
                "No progress found for this video. Start watching to create progress."));

        return mapper.toProgressResponseDTO(progress);
    }

    /**
     * Get all progress for(((currentUser + Course)))
     */
    public List<ProgressResponseDTO> getCourseProgress(UUID courseId) {
        User authUser = currentUser.getCurrentUser();

        // Validate course exists
        courseRepo.findById(courseId)
                .orElseThrow(() -> CustomResponseException.ResourceNotFound("Course not found with ID: " + courseId));

        List<Progress> progressList = progressRepo.findByUserIdAndCourseIdOrderByVideoSortOrderAsc(
                authUser.getId(), courseId);

        return progressList.stream()
                .map(mapper::toProgressResponseDTO)
                .toList();
    }

    /**
     * Get paginated progress for ((currentUser + All-Courses))
     */
    public Page<ProgressResponseDTO> getAllUserProgress(int page, int size) {
        User authUser = currentUser.getCurrentUser();

        Pageable pageable = PageRequest.of(page, size);
        Page<Progress> progressPage = progressRepo.findByUserIdOrderByLastWatchedAtDesc(
                authUser.getId(), pageable);

        return progressPage.map(mapper::toProgressResponseDTO);
    }


    // ***************************** ANALYTICS & SUMMARIES ***************************** //


    /**
     * Get progress analytics for a course (instructor only)
     */
    public Page<ProgressResponseDTO> getCourseProgressAnalytics(UUID courseId, int page, int size) {
        courseRepo.findById(courseId)
                .orElseThrow(() -> CustomResponseException.ResourceNotFound("Course not found with ID: " + courseId));

        Pageable pageable = PageRequest.of(page, size);
        Page<Progress> progressPage = progressRepo.findByCourseIdOrderByLastWatchedAtDesc(courseId, pageable);

        return progressPage.map(mapper::toProgressResponseDTO);
    }

    /**
     * Get list of users who completed a course
     */
    public List<UUID> getCompletedUsers(UUID courseId) {
        return progressRepo.findUsersWhoCompletedCourse(courseId);
    }

    // ***************************** UTILITY METHODS ***************************** //

    /**
     * Mark video as completed (useful for quick completion without watching)
     */
    public ProgressResponseDTO markVideoCompleted(UUID videoId) {
        User authUser = currentUser.getCurrentUser();

        Video video = videoRepo.findById(videoId)
                .orElseThrow(() -> CustomResponseException.ResourceNotFound("Video not found with ID: " + videoId));

        Course course = video.getSection().getCourse();

        Progress progress = progressRepo.findByUserIdAndCourseIdAndVideoId(
                authUser.getId(), course.getId(), videoId
        ).orElseGet(() -> createNewProgress(authUser, course, video));

        // Mark as fully completed
        progress.setWatchDurationSeconds(video.getDurationSeconds() != null ? video.getDurationSeconds() : 0);
        progress.setCompletionPercentage(100.0);
        progress.setIsCompleted(true);
        progress.setLastWatchedAt(LocalDateTime.now());

        Progress savedProgress = progressRepo.save(progress);

        return mapper.toProgressResponseDTO(savedProgress);
    }


}
