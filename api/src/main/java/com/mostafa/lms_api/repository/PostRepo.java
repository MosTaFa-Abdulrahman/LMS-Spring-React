package com.mostafa.lms_api.repository;

import com.mostafa.lms_api.model.Post;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.UUID;


@Repository
public interface PostRepo extends JpaRepository<Post, UUID> {
    //    Get All Posts for ((Specific-User))
    Page<Post> findByUserId(@Param("userId") UUID userId, Pageable pageable);

}