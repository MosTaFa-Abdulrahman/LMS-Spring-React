package com.mostafa.lms_api.controller;


import com.mostafa.lms_api.dto.PaginatedResponse;
import com.mostafa.lms_api.dto.course.CourseResponseDTO;
import com.mostafa.lms_api.dto.course.CourseSummaryDTO;
import com.mostafa.lms_api.dto.course.CreateCourseDTO;
import com.mostafa.lms_api.dto.course.UpdateCourseDTO;
import com.mostafa.lms_api.global.GlobalResponse;
import com.mostafa.lms_api.service.CourseService;
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
@RequestMapping("/api/courses")
public class CourseController {
    private final CourseService courseService;


    //    Create
    @PostMapping
    public ResponseEntity<GlobalResponse<CourseResponseDTO>> createCourse(
            @Valid @RequestBody CreateCourseDTO dto) {
        CourseResponseDTO createdCourse = courseService.createCourse(dto);
        GlobalResponse<CourseResponseDTO> res = new GlobalResponse<>(createdCourse);

        return new ResponseEntity<>(res, HttpStatus.CREATED);
    }

    //    Update
    @PutMapping("/{courseId}")
    public ResponseEntity<GlobalResponse<CourseResponseDTO>> updateCourse(
            @Valid @RequestBody UpdateCourseDTO dto,
            @PathVariable UUID courseId) {
        CourseResponseDTO updatedCourse = courseService.updateCourse(courseId, dto);
        GlobalResponse<CourseResponseDTO> res = new GlobalResponse<>(updatedCourse);

        return new ResponseEntity<>(res, HttpStatus.OK);
    }

    //    Delete
    @DeleteMapping("/{courseId}")
    public ResponseEntity<GlobalResponse<String>> deleteCourse(@PathVariable UUID courseId) {
        String deletedCourse = courseService.deleteCourse(courseId);
        GlobalResponse<String> res = new GlobalResponse<>(deletedCourse);

        return new ResponseEntity<>(res, HttpStatus.OK);
    }

    //    Get Single
    @GetMapping("/{courseId}")
    public ResponseEntity<GlobalResponse<CourseResponseDTO>> getSingle(@PathVariable UUID courseId) {
        CourseResponseDTO course = courseService.getSingle(courseId);
        GlobalResponse<CourseResponseDTO> res = new GlobalResponse<>(course);

        return new ResponseEntity<>(res, HttpStatus.OK);
    }

    //    Get All
    @GetMapping
    public ResponseEntity<GlobalResponse<PaginatedResponse<CourseResponseDTO>>> getAll(
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "10") int size,
            HttpServletRequest req
    ) {
        Page<CourseResponseDTO> courses = courseService.getAllCourses(page - 1, size);

        String baseUrl = req.getRequestURL().toString();
        String nextUrl = courses.hasNext() ? String.format("%s?page=%d&size=%d", baseUrl, page + 1, size) : null;
        String prevUrl = courses.hasPrevious() ? String.format("%s?page=%d&size=%d", baseUrl, page - 1, size) : null;

        var paginatedResponse = new PaginatedResponse<CourseResponseDTO>(
                courses.getContent(),
                courses.getNumber() + 1,
                courses.getTotalPages(),
                courses.getTotalElements(),
                courses.hasNext(),
                courses.hasPrevious(),
                nextUrl,
                prevUrl
        );

        return new ResponseEntity<>(new GlobalResponse<>(paginatedResponse), HttpStatus.OK);
    }


    // ***************************** ((Specifications)) *********************** //
    @GetMapping("/search")
    public ResponseEntity<GlobalResponse<PaginatedResponse<CourseSummaryDTO>>> searchCoursesByTitle(
            @RequestParam String title,
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "10") int size,
            HttpServletRequest req
    ) {
        Page<CourseSummaryDTO> courses = courseService.searchCoursesByTitle(title, page - 1, size);

        String baseUrl = req.getRequestURL().toString();
        String nextUrl = courses.hasNext() ? String.format("%s?page=%d&size=%d", baseUrl, page + 1, size) : null;
        String prevUrl = courses.hasPrevious() ? String.format("%s?page=%d&size=%d", baseUrl, page - 1, size) : null;

        var paginatedResponse = new PaginatedResponse<CourseSummaryDTO>(
                courses.getContent(),
                courses.getNumber() + 1,
                courses.getTotalPages(),
                courses.getTotalElements(),
                courses.hasNext(),
                courses.hasPrevious(),
                nextUrl,
                prevUrl
        );

        return new ResponseEntity<>(new GlobalResponse<>(paginatedResponse), HttpStatus.OK);
    }


}
