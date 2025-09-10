package com.mostafa.lms_api.controller;


import com.mostafa.lms_api.dto.PaginatedResponse;
import com.mostafa.lms_api.dto.section.CreateSectionDTO;
import com.mostafa.lms_api.dto.section.SectionResponseDTO;
import com.mostafa.lms_api.dto.section.UpdateSectionDTO;
import com.mostafa.lms_api.global.GlobalResponse;
import com.mostafa.lms_api.service.SectionService;
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
@RequestMapping("/api/sections")
public class SectionController {
    private final SectionService sectionService;


    //    Create
    @PostMapping
    public ResponseEntity<GlobalResponse<SectionResponseDTO>> createSection(
            @Valid @RequestBody CreateSectionDTO dto) {
        SectionResponseDTO createdSection = sectionService.createSection(dto);
        GlobalResponse<SectionResponseDTO> res = new GlobalResponse<>(createdSection);

        return new ResponseEntity<>(res, HttpStatus.CREATED);
    }

    //    Update
    @PutMapping("/{sectionId}")
    public ResponseEntity<GlobalResponse<SectionResponseDTO>> updateSection(
            @Valid @RequestBody UpdateSectionDTO dto,
            @PathVariable UUID sectionId) {
        SectionResponseDTO updatedSection = sectionService.updateSection(sectionId, dto);
        GlobalResponse<SectionResponseDTO> res = new GlobalResponse<>(updatedSection);

        return new ResponseEntity<>(res, HttpStatus.OK);
    }

    //    Delete
    @DeleteMapping("/{sectionId}")
    public ResponseEntity<GlobalResponse<String>> deleteSection(@PathVariable UUID sectionId) {
        String deletedSection = sectionService.deleteSection(sectionId);
        GlobalResponse<String> res = new GlobalResponse<>(deletedSection);

        return new ResponseEntity<>(res, HttpStatus.OK);
    }


    // ***************************** ((Specifications)) *********************** //
    // Get All Sections For Specific => Course
    @GetMapping("/course/{courseId}")
    public ResponseEntity<GlobalResponse<PaginatedResponse<SectionResponseDTO>>> getAllSections(
            @PathVariable UUID courseId,
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "10") int size,
            HttpServletRequest req) {
        Page<SectionResponseDTO> sections = sectionService.getAllSectionsForCourse(courseId, page - 1, size);

        String baseUrl = req.getRequestURL().toString();
        String nextUrl = sections.hasNext() ? String.format("%s?page=%d&size=%d", baseUrl, page + 1, size) : null;
        String prevUrl = sections.hasPrevious() ? String.format("%s?page=%d&size=%d", baseUrl, page - 1, size) : null;

        var paginatedResponse = new PaginatedResponse<SectionResponseDTO>(
                sections.getContent(),
                sections.getNumber() + 1,
                sections.getTotalPages(),
                sections.getTotalElements(),
                sections.hasNext(),
                sections.hasPrevious(),
                nextUrl,
                prevUrl
        );

        return new ResponseEntity<>(new GlobalResponse<>(paginatedResponse), HttpStatus.OK);
    }


}
