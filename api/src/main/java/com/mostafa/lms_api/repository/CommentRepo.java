package com.mostafa.lms_api.repository;

import com.mostafa.lms_api.model.Comment;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.UUID;


@Repository
public interface CommentRepo extends JpaRepository<Comment, UUID> {
    //    Get All Comments for Specific -> POST (Pagination)
    @Query("SELECT c FROM Comment c WHERE c.post.id = :postId")
    Page<Comment> findByPostId(@Param("postId") UUID postId, Pageable pageable);


}
