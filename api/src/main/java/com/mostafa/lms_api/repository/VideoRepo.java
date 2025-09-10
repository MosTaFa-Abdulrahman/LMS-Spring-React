package com.mostafa.lms_api.repository;

import com.mostafa.lms_api.model.Video;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;


@Repository
public interface VideoRepo extends JpaRepository<Video, UUID> {
    //    Get All Videos for Specific -> Section (Pagination)
    @Query("SELECT v FROM Video v WHERE v.section.id = :sectionId")
    Page<Video> findBySectionId(@Param("sectionId") UUID sectionId, Pageable pageable);


    // Get total duration in seconds for all videos in a course
    @Query("SELECT COALESCE(SUM(v.durationSeconds), 0) FROM Video v " +
            "JOIN v.section s " +
            "WHERE s.course.id = :courseId")
    Long getTotalDurationSecondsByCourseId(@Param("courseId") UUID courseId);


    // Course ((Transaction))
    @Query("SELECT v FROM Video v WHERE v.section.course.id = :courseId")
    List<Video> findVideosByCourseId(@Param("courseId") UUID courseId);


}
