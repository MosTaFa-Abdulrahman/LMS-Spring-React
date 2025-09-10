package com.mostafa.lms_api.service;


import com.mostafa.lms_api.dto.transaction.request.CreateCourseTransaction;
import com.mostafa.lms_api.dto.transaction.request.CreateFileTransaction;
import com.mostafa.lms_api.dto.transaction.request.CreateSectionTransaction;
import com.mostafa.lms_api.dto.transaction.request.CreateVideoTransaction;
import com.mostafa.lms_api.dto.transaction.response.CourseTransactionResponseDTO;
import com.mostafa.lms_api.dto.transaction.response.SectionTransactionResponseDTO;
import com.mostafa.lms_api.global.CustomResponseException;
import com.mostafa.lms_api.mapper.EntityDtoMapper;
import com.mostafa.lms_api.model.*;
import com.mostafa.lms_api.repository.CourseRepo;
import com.mostafa.lms_api.repository.FileRepo;
import com.mostafa.lms_api.repository.SectionRepo;
import com.mostafa.lms_api.repository.VideoRepo;
import com.mostafa.lms_api.utils.CurrentUser;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;


@Service
@RequiredArgsConstructor
public class CourseTransactionService {
    private final CurrentUser currentUser;
    private final CourseRepo courseRepo;
    private final SectionRepo sectionRepo;
    private final VideoRepo videoRepo;
    private final FileRepo fileRepo;
    private final EntityDtoMapper mapper;


    // ******************************** (((Helper)))  ******************************** //
    private double calculateTotalDuration(Course course) {
        try {
            List<Video> allVideos = videoRepo.findVideosByCourseId(course.getId());
            return allVideos.stream()
                    .mapToInt(video -> video.getDurationSeconds() != null ? video.getDurationSeconds() : 0)
                    .sum() / 3600.0; // Convert seconds to hours
        } catch (Exception e) {
            return 0.0;
        }
    }

    //    Create Course ((Transaction))
    @Transactional
    public CourseTransactionResponseDTO createCourse(CreateCourseTransaction dto) {
        // Get current user
        User user = currentUser.getCurrentUser();
        if (user == null) {
            throw CustomResponseException.BadCredentials();
        }

        // Validate sections
        if (dto.sections() == null || dto.sections().isEmpty()) {
            throw CustomResponseException.BadRequest("Course must have at least one section");
        }

        try {
            // 1. Create and save the course
            Course course = Course.builder()
                    .title(dto.title())
                    .description(dto.description())
                    .shortDescription(dto.shortDescription())
                    .courseImg(dto.courseImg())
                    .level(dto.level())
                    .price(BigDecimal.ZERO) // Will be calculated from sections
                    .user(user)
                    .build();

            course = courseRepo.save(course);

            // 2. Create sections with their content
            List<SectionTransactionResponseDTO> sectionResponses = new ArrayList<>();
            BigDecimal totalCoursePrice = BigDecimal.ZERO;

            for (CreateSectionTransaction sectionDto : dto.sections()) {
                // Validate section data
                if (sectionDto.price() == null || sectionDto.price().compareTo(BigDecimal.ZERO) <= 0) {
                    throw CustomResponseException.BadRequest("Section price must be greater than 0");
                }

                // Create and save section
                Section section = Section.builder()
                        .title(sectionDto.title())
                        .description(sectionDto.description())
                        .price(sectionDto.price())
                        .sortOrder(sectionDto.sortOrder())
                        .course(course)
                        .build();

                section = sectionRepo.save(section);

                // Add section price to total course price
                totalCoursePrice = totalCoursePrice.add(sectionDto.price());

                // Create videos for this section
                List<Video> videos = new ArrayList<>();
                if (sectionDto.videos() != null) {
                    for (CreateVideoTransaction videoDto : sectionDto.videos()) {
                        // Validate video data
                        if (videoDto.durationSeconds() == null || videoDto.durationSeconds() <= 0) {
                            throw CustomResponseException.BadRequest("Video duration must be greater than 0 seconds");
                        }

                        Video video = Video.builder()
                                .title(videoDto.title())
                                .videoUrl(videoDto.videoUrl())
                                .sortOrder(videoDto.sortOrder())
                                .durationSeconds(videoDto.durationSeconds())
                                .isPreview(videoDto.isPreview() != null ? videoDto.isPreview() : false)
                                .section(section)
                                .build();

                        video = videoRepo.save(video);
                        videos.add(video);
                    }
                }

                // Create files for this section
                List<File> files = new ArrayList<>();
                if (sectionDto.files() != null) {
                    for (CreateFileTransaction fileDto : sectionDto.files()) {
                        File file = File.builder()
                                .title(fileDto.title())
                                .fileUrl(fileDto.fileUrl())
                                .isPreview(fileDto.isPreview() != null ? fileDto.isPreview() : false)
                                .section(section)
                                .build();

                        file = fileRepo.save(file);
                        files.add(file);
                    }
                }

                // Map to response DTOs
                SectionTransactionResponseDTO sectionResponse = new SectionTransactionResponseDTO(
                        videos.stream().map(mapper::toVideoResponseDTO).toList(),
                        files.stream().map(mapper::toFileResponseDTO).toList()
                );
                sectionResponses.add(sectionResponse);
            }

            // 3. Update course with calculated total price
            course.setPrice(totalCoursePrice);
            course = courseRepo.save(course);

            // 4. Calculate estimated duration from all videos
            double totalDurationHours = calculateTotalDuration(course);
            course.setEstimatedDurationHours(totalDurationHours);
            course = courseRepo.save(course);


            // 5. Return the complete response
            return new CourseTransactionResponseDTO(
                    mapper.toCourseResponseDTO(course),
                    sectionResponses
            );

        } catch (CustomResponseException e) {
            throw e;
        } catch (Exception e) {
            throw CustomResponseException.BadRequest("Failed to create course: " + e.getMessage());
        }
    }


}
