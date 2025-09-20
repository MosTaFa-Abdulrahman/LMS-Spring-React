package com.mostafa.lms_api.service;


import com.mostafa.lms_api.dto.video.CreateVideoDTO;
import com.mostafa.lms_api.dto.video.UpdateVideoDTO;
import com.mostafa.lms_api.dto.video.VideoResponseDTO;
import com.mostafa.lms_api.enums.EnrollmentStatus;
import com.mostafa.lms_api.global.CustomResponseException;
import com.mostafa.lms_api.mapper.EntityDtoMapper;
import com.mostafa.lms_api.model.Section;
import com.mostafa.lms_api.model.User;
import com.mostafa.lms_api.model.Video;
import com.mostafa.lms_api.repository.EnrollmentRepo;
import com.mostafa.lms_api.repository.SectionRepo;
import com.mostafa.lms_api.repository.VideoRepo;
import com.mostafa.lms_api.utils.CurrentUser;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.UUID;


@Service
@RequiredArgsConstructor
public class VideoService {
    private final VideoRepo videoRepo;
    private final SectionRepo sectionRepo;
    private final EnrollmentRepo enrollmentRepo;
    private final EntityDtoMapper mapper;
    private final CourseService courseService;
    private final CurrentUser currentUser;


    //    Create
    public VideoResponseDTO createVideo(CreateVideoDTO dto) {
        Section section = sectionRepo.findById(dto.sectionId())
                .orElseThrow(() -> CustomResponseException.ResourceNotFound("Section not found with this ID: " + dto.sectionId()));

        Video video = mapper.toVideoEntity(dto);
        video.setSection(section);

        Video savedVideo = videoRepo.save(video);

        // NEW: Auto-update course estimated duration
        courseService.updateEstimatedDuration(section.getCourse().getId());

        return mapper.toVideoResponseDTO(savedVideo);
    }

    //    Update BY ((videoId))
    public VideoResponseDTO updateVideo(UUID videoId, UpdateVideoDTO dto) {
        Video existingVideo = videoRepo.findById(videoId)
                .orElseThrow(() -> CustomResponseException.ResourceNotFound("Video not found with this ID: " + videoId));

        // New: Get course ID before update (Old)
        UUID courseId = existingVideo.getSection().getCourse().getId();

        if (dto.title() != null) {
            existingVideo.setTitle(dto.title());
        }
        if (dto.isPreview() != null) {
            existingVideo.setIsPreview(dto.isPreview());
        }
        if (dto.sortOrder() != null) {
            existingVideo.setSortOrder(dto.sortOrder());
        }
        if (dto.durationSeconds() != null) {
            existingVideo.setDurationSeconds(dto.durationSeconds());
        }
        if (dto.sectionId() != null) {
            Section section = sectionRepo.findById(dto.sectionId())
                    .orElseThrow(() -> CustomResponseException.ResourceNotFound("Section not found with this ID: " + dto.sectionId()));
            existingVideo.setSection(section);

            // New: If section changed, update both old and new course durations
            UUID newCourseId = section.getCourse().getId(); // (New)
            if (!courseId.equals(newCourseId)) {
                courseService.updateEstimatedDuration(courseId); // Update old course
                courseService.updateEstimatedDuration(newCourseId); // Update new course
            }
        }

        Video updatedVideo = videoRepo.save(existingVideo);

        // NEW: Auto-update course estimated duration
        courseService.updateEstimatedDuration(courseId);

        return mapper.toVideoResponseDTO(updatedVideo);
    }

    //    Delete BY ((videoId))  =>  ||||Do not Delete||||
    public String deleteVideo(UUID videoId) {
        Video video = videoRepo.findById(videoId)
                .orElseThrow(() -> CustomResponseException.ResourceNotFound("Video not found with this ID: " + videoId));

        // New: Get course ID before deletion
        UUID courseId = video.getSection().getCourse().getId();

        videoRepo.delete(video);

        // NEW: Auto-update course estimated duration after deletion
        courseService.updateEstimatedDuration(courseId);

        return "Video Deleted Success";
    }

    // ***************************** ((Specifications)) *********************** //
    // Get All Videos Dependent on (sectionId) with access control
    public Page<VideoResponseDTO> getAllVideosForSection(UUID sectionId, int page, int size) {
        if (sectionId == null) {
            throw new IllegalArgumentException("Section ID cannot be null");
        }

        sectionRepo.findById(sectionId)
                .orElseThrow(() -> CustomResponseException.ResourceNotFound("Section not found with this ID: " + sectionId));

        // Get current user
        User authUser = currentUser.getCurrentUser();

        // Check if user has paid for this section
        boolean hasAccess = hasUserPaidForSection(authUser.getId(), sectionId);

        Pageable pageable = PageRequest.of(page, size);
        Page<Video> videosPage = videoRepo.findBySectionId(sectionId, pageable);

        // Convert Page<Video> to Page<VideoResponseDTO> with access control
        return videosPage.map(video -> mapper.toVideoResponseDTOWithAccess(video, hasAccess));
    }

    // Helper method to check if user has paid for section
    private boolean hasUserPaidForSection(UUID userId, UUID sectionId) {
        return enrollmentRepo.findByUserIdAndSectionId(userId, sectionId)
                .map(enrollment -> enrollment.getStatus() == EnrollmentStatus.ACTIVE)
                .orElse(false);
    }

}
