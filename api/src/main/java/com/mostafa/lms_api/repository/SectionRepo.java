package com.mostafa.lms_api.repository;

import com.mostafa.lms_api.model.Section;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.UUID;


@Repository
public interface SectionRepo extends JpaRepository<Section, UUID> {
    //    Get All Sections for Specific -> Course (Pagination)
    @Query("SELECT s FROM Section s WHERE s.course.id = :courseId")
    Page<Section> findByCourseId(@Param("courseId") UUID courseId, Pageable pageable);


}
