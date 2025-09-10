package com.mostafa.lms_api.controller;

import com.mostafa.lms_api.dto.PaginatedResponse;
import com.mostafa.lms_api.dto.enrollment.CreateEnrollmentDTO;
import com.mostafa.lms_api.dto.enrollment.EnrollmentResponseDTO;
import com.mostafa.lms_api.global.GlobalResponse;
import com.mostafa.lms_api.service.EnrollmentService;
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
@RequestMapping("/api/enrollments")
public class EnrollmentController {
    private final EnrollmentService enrollmentService;


    // Create
    @PostMapping
    public ResponseEntity<GlobalResponse<EnrollmentResponseDTO>> createEnrollment(
            @Valid @RequestBody CreateEnrollmentDTO dto) {
        EnrollmentResponseDTO createdEnrollment = enrollmentService.createEnrollment(dto);
        GlobalResponse<EnrollmentResponseDTO> res = new GlobalResponse<>(createdEnrollment);

        return new ResponseEntity<>(res, HttpStatus.CREATED);
    }

    // Get All for User
    @GetMapping("/user/{userId}")
    public ResponseEntity<GlobalResponse<PaginatedResponse<EnrollmentResponseDTO>>> getAllEnrollmentsForUser(
            @PathVariable UUID userId,
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "10") int size,
            HttpServletRequest req) {
        Page<EnrollmentResponseDTO> enrollments = enrollmentService.getAllEnrollmentsForUser(userId, page - 1, size);

        String baseUrl = req.getRequestURL().toString();
        String nextUrl = enrollments.hasNext() ? String.format("%s?page=%d&size=%d", baseUrl, page + 1, size) : null;
        String prevUrl = enrollments.hasPrevious() ? String.format("%s?page=%d&size=%d", baseUrl, page - 1, size) : null;

        var paginatedResponse = new PaginatedResponse<>(
                enrollments.getContent(),
                enrollments.getNumber() + 1,
                enrollments.getTotalPages(),
                enrollments.getTotalElements(),
                enrollments.hasNext(),
                enrollments.hasPrevious(),
                nextUrl,
                prevUrl
        );

        return new ResponseEntity<>(new GlobalResponse<>(paginatedResponse), HttpStatus.OK);
    }

    // Get All for Section
    @GetMapping("/section/{sectionId}")
    public ResponseEntity<GlobalResponse<PaginatedResponse<EnrollmentResponseDTO>>> getAllEnrollmentsForSection(
            @PathVariable UUID sectionId,
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "10") int size,
            HttpServletRequest req) {
        Page<EnrollmentResponseDTO> enrollments = enrollmentService.getAllEnrollmentsForSection(sectionId, page - 1, size);

        String baseUrl = req.getRequestURL().toString();
        String nextUrl = enrollments.hasNext() ? String.format("%s?page=%d&size=%d", baseUrl, page + 1, size) : null;
        String prevUrl = enrollments.hasPrevious() ? String.format("%s?page=%d&size=%d", baseUrl, page - 1, size) : null;

        var paginatedResponse = new PaginatedResponse<>(
                enrollments.getContent(),
                enrollments.getNumber() + 1,
                enrollments.getTotalPages(),
                enrollments.getTotalElements(),
                enrollments.hasNext(),
                enrollments.hasPrevious(),
                nextUrl,
                prevUrl
        );

        return new ResponseEntity<>(new GlobalResponse<>(paginatedResponse), HttpStatus.OK);
    }


}
