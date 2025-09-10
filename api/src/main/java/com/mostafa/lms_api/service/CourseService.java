package com.mostafa.lms_api.service;

import com.mostafa.lms_api.dto.course.CourseResponseDTO;
import com.mostafa.lms_api.dto.course.CourseSummaryDTO;
import com.mostafa.lms_api.dto.course.CreateCourseDTO;
import com.mostafa.lms_api.dto.course.UpdateCourseDTO;
import com.mostafa.lms_api.global.CustomResponseException;
import com.mostafa.lms_api.mapper.EntityDtoMapper;
import com.mostafa.lms_api.model.Course;
import com.mostafa.lms_api.model.User;
import com.mostafa.lms_api.repository.CourseRepo;
import com.mostafa.lms_api.repository.UserRepo;
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
public class CourseService {
    private final CourseRepo courseRepo;
    private final UserRepo userRepo;
    private final VideoRepo videoRepo;
    private final EntityDtoMapper mapper;
    private final CurrentUser currentUser;


    //    Create
    public CourseResponseDTO createCourse(CreateCourseDTO dto) {
        // currentUser
        User authUser = currentUser.getCurrentUser();

        Course course = mapper.toCourseEntity(dto);
        course.setUser(authUser);

        Course savedCourse = courseRepo.save(course);

        return mapper.toCourseResponseDTO(savedCourse);
    }

    //    Update BY ((courseId))
    public CourseResponseDTO updateCourse(UUID courseId, UpdateCourseDTO dto) {
        Course existingCourse = courseRepo.findById(courseId)
                .orElseThrow(() -> CustomResponseException.ResourceNotFound("Course not found with this ID: " + courseId));

        if (dto.title() != null) {
            existingCourse.setTitle(dto.title());
        }
        if (dto.description() != null) {
            existingCourse.setDescription(dto.description());
        }
        if (dto.shortDescription() != null) {
            existingCourse.setShortDescription(dto.shortDescription());
        }
        if (dto.courseImg() != null) {
            existingCourse.setCourseImg(dto.courseImg());
        }
        if (dto.status() != null) {
            existingCourse.setStatus(dto.status());
        }
        if (dto.level() != null) {
            existingCourse.setLevel(dto.level());
        }
        if (dto.estimatedDurationHours() != null) {
            existingCourse.setEstimatedDurationHours(dto.estimatedDurationHours());
        }

        Course updatedCourse = courseRepo.save(existingCourse);

        return mapper.toCourseResponseDTO(updatedCourse);
    }

    //    Delete BY ((courseId))
    public String deleteCourse(UUID courseId) {
        Course course = courseRepo.findById(courseId)
                .orElseThrow(() -> CustomResponseException.ResourceNotFound("Course not found with this ID: " + courseId));

        courseRepo.delete(course);

        return "Course Deleted Success";
    }

    //    Get BY ((courseId))
    public CourseResponseDTO getSingle(UUID courseId) {
        Course course = courseRepo.findById(courseId)
                .orElseThrow(() -> CustomResponseException.ResourceNotFound("Course not found with this ID: " + courseId));

        return mapper.toCourseResponseDTO(course);
    }

    //    Get All
    public Page<CourseResponseDTO> getAllCourses(int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<Course> coursesPage = courseRepo.findAll(pageable);

        // Convert Page<Course> to Page<CourseResponseDTO>
        return coursesPage.map(mapper::toCourseResponseDTO);
    }


    // ***************************** ((Specifications)) *********************** //
    // New: Calculate and update estimated duration automatically => ((used in -> VideoService 😉))
    public void updateEstimatedDuration(UUID courseId) {
        Course course = courseRepo.findById(courseId)
                .orElseThrow(() -> CustomResponseException.ResourceNotFound("Course not found with this ID: " + courseId));

        // Get total duration in seconds for all videos in this course
        Long totalDurationSeconds = videoRepo.getTotalDurationSecondsByCourseId(courseId);

        if (totalDurationSeconds == null) {
            totalDurationSeconds = 0L;
        }

        // Convert seconds to hours (with decimal precision)
        Double estimatedHours = totalDurationSeconds / 3600.0;

        // Round to 2 decimal places
        estimatedHours = Math.round(estimatedHours * 100.0) / 100.0;

        // Update the course with calculated duration
        course.setEstimatedDurationHours(estimatedHours);
        courseRepo.save(course);
    }


    // Search courses by title with pagination
    public Page<CourseSummaryDTO> searchCoursesByTitle(String title, int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<Course> coursesPage = courseRepo.searchByTitle(title, pageable);

        // Convert Page<Course> to Page<CourseSummaryDTO>
        return coursesPage.map(mapper::toCourseSummaryDTO);
    }


}
