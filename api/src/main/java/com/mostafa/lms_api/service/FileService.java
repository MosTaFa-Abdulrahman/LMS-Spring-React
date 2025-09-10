package com.mostafa.lms_api.service;


import com.mostafa.lms_api.dto.file.CreateFileDTO;
import com.mostafa.lms_api.dto.file.FileResponseDTO;
import com.mostafa.lms_api.dto.file.UpdateFileDTO;
import com.mostafa.lms_api.enums.EnrollmentStatus;
import com.mostafa.lms_api.global.CustomResponseException;
import com.mostafa.lms_api.mapper.EntityDtoMapper;
import com.mostafa.lms_api.model.File;
import com.mostafa.lms_api.model.Section;
import com.mostafa.lms_api.model.User;
import com.mostafa.lms_api.repository.EnrollmentRepo;
import com.mostafa.lms_api.repository.FileRepo;
import com.mostafa.lms_api.repository.SectionRepo;
import com.mostafa.lms_api.utils.CurrentUser;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.UUID;


@Service
@RequiredArgsConstructor
public class FileService {
    private final FileRepo fileRepo;
    private final SectionRepo sectionRepo;
    private final EnrollmentRepo enrollmentRepo;
    private final EntityDtoMapper mapper;
    private final CurrentUser currentUser;


    //    Create
    public FileResponseDTO createFile(CreateFileDTO dto) {
        Section section = sectionRepo.findById(dto.sectionId())
                .orElseThrow(() -> CustomResponseException.ResourceNotFound("Section not found with this ID: " + dto.sectionId()));

        File file = mapper.toFileEntity(dto);
        file.setSection(section);

        File savedFile = fileRepo.save(file);

        return mapper.toFileResponseDTO(savedFile);
    }

    //    Update BY ((fileId))
    public FileResponseDTO updateFile(UUID fileId, UpdateFileDTO dto) {
        File existingFile = fileRepo.findById(fileId)
                .orElseThrow(() -> CustomResponseException.ResourceNotFound("File not found with this ID: " + fileId));

        if (dto.title() != null) {
            existingFile.setTitle(dto.title());
        }
        if (dto.isPreview() != null) {
            existingFile.setIsPreview(dto.isPreview());
        }
        if (dto.sectionId() != null) {
            Section section = sectionRepo.findById(dto.sectionId())
                    .orElseThrow(() -> CustomResponseException.ResourceNotFound("Section not found with this ID: " + dto.sectionId()));
            existingFile.setSection(section);
        }

        File updatedFile = fileRepo.save(existingFile);

        return mapper.toFileResponseDTO(updatedFile);
    }

    //    Delete BY ((fileId))  =>  ||||Do not Delete||||
    public String deleteFile(UUID fileId) {
        File file = fileRepo.findById(fileId)
                .orElseThrow(() -> CustomResponseException.ResourceNotFound("File not found with this ID: " + fileId));

        fileRepo.delete(file);

        return "File Deleted Success";
    }

    // ***************************** ((Specifications)) *********************** //
    // Get All Files Dependent on (sectionId) with access control
    public Page<FileResponseDTO> getAllFilesForSection(UUID sectionId, int page, int size) {
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
        Page<File> filesPage = fileRepo.findBySectionId(sectionId, pageable);

        // Convert Page<File> to Page<FileResponseDTO> with access control
        return filesPage.map(file -> mapper.toFileResponseDTOWithAccess(file, hasAccess));
    }

    // Helper method to check if user has paid for section
    private boolean hasUserPaidForSection(UUID userId, UUID sectionId) {
        return enrollmentRepo.findByUserIdAndSectionId(userId, sectionId)
                .map(enrollment -> enrollment.getStatus() == EnrollmentStatus.ACTIVE)
                .orElse(false);
    }

}
