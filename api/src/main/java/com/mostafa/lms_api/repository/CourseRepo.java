package com.mostafa.lms_api.repository;

import com.mostafa.lms_api.model.Course;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.UUID;


@Repository
public interface CourseRepo extends JpaRepository<Course, UUID> {
    // Search By Title
    @Query("SELECT c FROM Course c WHERE LOWER(c.title) LIKE LOWER(CONCAT('%', :title, '%'))")
    Page<Course> searchByTitle(@Param("title") String title, Pageable pageable);

}
