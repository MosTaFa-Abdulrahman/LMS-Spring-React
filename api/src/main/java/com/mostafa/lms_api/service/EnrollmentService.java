package com.mostafa.lms_api.service;


import com.mostafa.lms_api.dto.enrollment.CreateEnrollmentDTO;
import com.mostafa.lms_api.dto.enrollment.EnrollmentResponseDTO;
import com.mostafa.lms_api.enums.EnrollmentStatus;
import com.mostafa.lms_api.global.CustomResponseException;
import com.mostafa.lms_api.mapper.EntityDtoMapper;
import com.mostafa.lms_api.model.Enrollment;
import com.mostafa.lms_api.model.Section;
import com.mostafa.lms_api.model.User;
import com.mostafa.lms_api.repository.EnrollmentRepo;
import com.mostafa.lms_api.repository.SectionRepo;
import com.mostafa.lms_api.repository.UserRepo;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.UUID;


@Service
@RequiredArgsConstructor
public class EnrollmentService {
    private final EnrollmentRepo enrollmentRepo;
    private final SectionRepo sectionRepo;
    private final EntityDtoMapper mapper;
    private final UserRepo userRepo;


    // ********************************** ((Helper)) **************************************** //
    private EnrollmentStatus determineEnrollmentStatus(BigDecimal amountPaid, BigDecimal sectionPrice) {
        if (amountPaid == null || sectionPrice == null) {
            return EnrollmentStatus.PENDING_PAID;
        }

        return amountPaid.compareTo(sectionPrice) >= 0 ?
                EnrollmentStatus.ACTIVE : EnrollmentStatus.PENDING_PAID;
    }

    //    Create
    @Transactional
    public EnrollmentResponseDTO createEnrollment(CreateEnrollmentDTO dto) {
        // Check User
        User user = userRepo.findById(dto.userId())
                .orElseThrow((() -> CustomResponseException.ResourceNotFound("User not found with this ID: " + dto.userId())));

        // Validate section exists
        Section section = sectionRepo.findById(dto.sectionId())
                .orElseThrow(() -> new RuntimeException("Section not found with ID: " + dto.sectionId()));

        // Check if user is already enrolled
        if (enrollmentRepo.existsByUserIdAndSectionId(dto.userId(), dto.sectionId())) {
            throw CustomResponseException.BadRequest("User is already enrolled in this section");
        }

        // Determine enrollment status based on payment
        EnrollmentStatus status = determineEnrollmentStatus(dto.amountPaid(), section.getPrice());

        // Create enrollment
        Enrollment enrollment = Enrollment.builder()
                .user(user)
                .section(section)
                .amountPaid(dto.amountPaid())
                .status(status)
                .build();

        enrollment = enrollmentRepo.save(enrollment);


        return mapper.toEnrollmentResponseDTO(enrollment);
    }

    //    Get All For ((Specific-User))
    public Page<EnrollmentResponseDTO> getAllEnrollmentsForUser(UUID userId, int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<Enrollment> enrollments = enrollmentRepo.findAllByUserIdWithDetails(userId, pageable);

        return enrollments.map(mapper::toEnrollmentResponseDTO);
    }

    //    Get All For ((Specific-Section))
    public Page<EnrollmentResponseDTO> getAllEnrollmentsForSection(UUID sectionId, int page, int size) {
        // Validate section exists
        if (!sectionRepo.existsById(sectionId)) {
            throw new RuntimeException("Section not found with ID: " + sectionId);
        }

        Pageable pageable = PageRequest.of(page, size);
        Page<Enrollment> enrollments = enrollmentRepo.findAllBySectionIdWithDetails(sectionId, pageable);

        return enrollments.map(mapper::toEnrollmentResponseDTO);
    }


}
