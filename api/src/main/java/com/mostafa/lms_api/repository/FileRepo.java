package com.mostafa.lms_api.repository;

import com.mostafa.lms_api.model.File;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.UUID;


@Repository
public interface FileRepo extends JpaRepository<File, UUID> {
    //    Get All Files for Specific -> Section (Pagination)
    @Query("SELECT f FROM File f WHERE f.section.id = :sectionId")
    Page<File> findBySectionId(@Param("sectionId") UUID sectionId, Pageable pageable);


}
