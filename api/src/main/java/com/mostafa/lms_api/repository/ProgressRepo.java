package com.mostafa.lms_api.repository;

import com.mostafa.lms_api.model.Progress;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;


@Repository
public interface ProgressRepo extends JpaRepository<Progress, UUID> {
    // Find specific progress entry
    Optional<Progress> findByUserIdAndCourseIdAndVideoId(UUID userId, UUID courseId, UUID videoId);

    // Find all progress for a user in a specific course
    List<Progress> findByUserIdAndCourseIdOrderByVideoSortOrderAsc(UUID userId, UUID courseId);

    // Find all progress for a user
    Page<Progress> findByUserIdOrderByLastWatchedAtDesc(UUID userId, Pageable pageable);

    // Find all progress for a course (for instructor analytics)
    Page<Progress> findByCourseIdOrderByLastWatchedAtDesc(UUID courseId, Pageable pageable);

    // Find users who completed a specific course (for instructor analytics)
    @Query("SELECT DISTINCT p.user.id FROM Progress p WHERE p.course.id = :courseId " +
            "GROUP BY p.user.id HAVING COUNT(p) = (SELECT COUNT(v) FROM Video v JOIN v.section s WHERE s.course.id = :courseId) " +
            "AND COUNT(CASE WHEN p.isCompleted = true THEN 1 END) = COUNT(p)")
    List<UUID> findUsersWhoCompletedCourse(@Param("courseId") UUID courseId);

    
}
