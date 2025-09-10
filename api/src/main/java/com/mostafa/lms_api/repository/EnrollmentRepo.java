package com.mostafa.lms_api.repository;

import com.mostafa.lms_api.model.Enrollment;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;


@Repository
public interface EnrollmentRepo extends JpaRepository<Enrollment, UUID> {
    // Check if user is already enrolled in section
    boolean existsByUserIdAndSectionId(UUID userId, UUID sectionId);

    // Find specific enrollment by user and section
    @Query("SELECT e FROM Enrollment e WHERE e.user.id = :userId AND e.section.id = :sectionId")
    Optional<Enrollment> findByUserIdAndSectionId(@Param("userId") UUID userId, @Param("sectionId") UUID sectionId);

    // Find all enrollments for a user with course details
    @Query("SELECT e FROM Enrollment e " +
            "JOIN FETCH e.section s " +
            "JOIN FETCH s.course c " +
            "JOIN FETCH e.user u " +
            "WHERE e.user.id = :userId")
    Page<Enrollment> findAllByUserIdWithDetails(@Param("userId") UUID userId, Pageable pageable);

    // Find all enrollments for a section
    @Query("SELECT e FROM Enrollment e " +
            "JOIN FETCH e.user u " +
            "JOIN FETCH e.section s " +
            "WHERE e.section.id = :sectionId")
    Page<Enrollment> findAllBySectionIdWithDetails(@Param("sectionId") UUID sectionId, Pageable pageable);


}
