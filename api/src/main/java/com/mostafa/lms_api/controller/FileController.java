package com.mostafa.lms_api.controller;


import com.mostafa.lms_api.dto.PaginatedResponse;
import com.mostafa.lms_api.dto.file.CreateFileDTO;
import com.mostafa.lms_api.dto.file.FileResponseDTO;
import com.mostafa.lms_api.dto.file.UpdateFileDTO;
import com.mostafa.lms_api.global.GlobalResponse;
import com.mostafa.lms_api.service.FileService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

//fileId
@RestController
@RequiredArgsConstructor
@RequestMapping("/api/files")
public class FileController {
    private final FileService fileService;


    //    Create
    @PostMapping
    public ResponseEntity<GlobalResponse<FileResponseDTO>> createFile(
            @Valid @RequestBody CreateFileDTO dto) {
        FileResponseDTO createdVideo = fileService.createFile(dto);
        GlobalResponse<FileResponseDTO> res = new GlobalResponse<>(createdVideo);

        return new ResponseEntity<>(res, HttpStatus.CREATED);
    }

    //    Update
    @PutMapping("/{fileId}")
    public ResponseEntity<GlobalResponse<FileResponseDTO>> updateFile(
            @Valid @RequestBody UpdateFileDTO dto,
            @PathVariable UUID fileId) {
        FileResponseDTO updatedFile = fileService.updateFile(fileId, dto);
        GlobalResponse<FileResponseDTO> res = new GlobalResponse<>(updatedFile);

        return new ResponseEntity<>(res, HttpStatus.OK);
    }

    //    Delete
    @DeleteMapping("/{fileId}")
    public ResponseEntity<GlobalResponse<String>> deleteFile(@PathVariable UUID fileId) {
        String deletedFile = fileService.deleteFile(fileId);
        GlobalResponse<String> res = new GlobalResponse<>(deletedFile);

        return new ResponseEntity<>(res, HttpStatus.OK);
    }


    // ***************************** ((Specifications)) *********************** //
    // Get All Files For Specific => Section
    @GetMapping("/section/{sectionId}")
    public ResponseEntity<GlobalResponse<PaginatedResponse<FileResponseDTO>>> getAllFiles(
            @PathVariable UUID sectionId,
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "10") int size,
            HttpServletRequest req) {
        Page<FileResponseDTO> files = fileService.getAllFilesForSection(sectionId, page - 1, size);

        String baseUrl = req.getRequestURL().toString();
        String nextUrl = files.hasNext() ? String.format("%s?page=%d&size=%d", baseUrl, page + 1, size) : null;
        String prevUrl = files.hasPrevious() ? String.format("%s?page=%d&size=%d", baseUrl, page - 1, size) : null;

        var paginatedResponse = new PaginatedResponse<FileResponseDTO>(
                files.getContent(),
                files.getNumber() + 1,
                files.getTotalPages(),
                files.getTotalElements(),
                files.hasNext(),
                files.hasPrevious(),
                nextUrl,
                prevUrl
        );

        return new ResponseEntity<>(new GlobalResponse<>(paginatedResponse), HttpStatus.OK);
    }


}
