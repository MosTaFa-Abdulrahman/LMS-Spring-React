package com.mostafa.lms_api.service;

import com.mostafa.lms_api.dto.section.CreateSectionDTO;
import com.mostafa.lms_api.dto.section.SectionResponseDTO;
import com.mostafa.lms_api.dto.section.UpdateSectionDTO;
import com.mostafa.lms_api.global.CustomResponseException;
import com.mostafa.lms_api.mapper.EntityDtoMapper;
import com.mostafa.lms_api.model.Course;
import com.mostafa.lms_api.model.Section;
import com.mostafa.lms_api.model.Video;
import com.mostafa.lms_api.repository.CourseRepo;
import com.mostafa.lms_api.repository.SectionRepo;
import com.mostafa.lms_api.repository.VideoRepo;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.UUID;


@Service
@RequiredArgsConstructor
public class SectionService {
    private final SectionRepo sectionRepo;
    private final CourseRepo courseRepo;
    private final VideoRepo videoRepo;
    private final EntityDtoMapper mapper;


    //    Create
    public SectionResponseDTO createSection(CreateSectionDTO dto) {
        Course course = courseRepo.findById(dto.courseId())
                .orElseThrow(() -> CustomResponseException.ResourceNotFound("Course not found with this ID: " + dto.courseId()));

        Section section = mapper.toSectionEntity(dto);
        section.setCourse(course);

        Section savedSection = sectionRepo.save(section);

        return mapper.toSectionResponseDTO(savedSection, null);
    }

    //    Update BY ((sectionId))
    public SectionResponseDTO updateSection(UUID sectionId, UpdateSectionDTO dto) {
        Section existingSection = sectionRepo.findById(sectionId)
                .orElseThrow(() -> CustomResponseException.ResourceNotFound("Section not found with this ID: " + sectionId));

        if (dto.title() != null) {
            existingSection.setTitle(dto.title());
        }
        if (dto.description() != null) {
            existingSection.setDescription(dto.description());
        }
        if (dto.price() != null) {
            existingSection.setPrice(dto.price());
        }
        if (dto.sortOrder() != null) {
            existingSection.setSortOrder(dto.sortOrder());
        }

        Section updatedSection = sectionRepo.save(existingSection);
        // Get Section All Duration
        String duration = getSectionDurationFormatted(updatedSection.getId());

        return mapper.toSectionResponseDTO(updatedSection, duration);
    }

    //    Delete BY ((sectionId))  =>  ||||Do not Delete||||
    public String deleteSection(UUID sectionId) {
        Section section = sectionRepo.findById(sectionId)
                .orElseThrow(() -> CustomResponseException.ResourceNotFound("Section not found with this ID: " + sectionId));

        sectionRepo.delete(section);

        return "Section Deleted Success";
    }


    // ***************************** ((Specifications)) *********************** //
    //     Get All Sections Dependent on (courseId)
    public Page<SectionResponseDTO> getAllSectionsForCourse(UUID courseId, int page, int size) {
        if (courseId == null) {
            throw new IllegalArgumentException("Course ID cannot be null");
        }

        courseRepo.findById(courseId)
                .orElseThrow(() -> CustomResponseException.ResourceNotFound("Course not found with this ID: " + courseId));


        Pageable pageable = PageRequest.of(page, size);
        Page<Section> sectionsPage = sectionRepo.findByCourseId(courseId, pageable);

        // Convert Page<Section> to Page<SectionResponseDTO>
        return sectionsPage.map(section -> {
            String duration = getSectionDurationFormatted(section.getId());
            return mapper.toSectionResponseDTO(section, duration);
        });
    }


    // NEW: Utility method to get total duration for a section ((Helper))
    public String getSectionDurationFormatted(UUID sectionId) {
        Page<Video> videos = videoRepo.findBySectionId(sectionId, Pageable.unpaged());

        long totalSeconds = videos.getContent().stream()
                .mapToLong(video -> video.getDurationSeconds() != null ? video.getDurationSeconds() : 0)
                .sum();

        long hours = totalSeconds / 3600;
        long minutes = (totalSeconds % 3600) / 60;
        long seconds = totalSeconds % 60;

        if (hours > 0) {
            return String.format("%d hours, %d minutes", hours, minutes);
        } else if (minutes > 0) {
            return String.format("%d minutes, %d seconds", minutes, seconds);
        } else {
            return String.format("%d seconds", seconds);
        }
    }


}
