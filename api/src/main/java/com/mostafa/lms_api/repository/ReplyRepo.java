package com.mostafa.lms_api.repository;

import com.mostafa.lms_api.model.Reply;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.UUID;


@Repository
public interface ReplyRepo extends JpaRepository<Reply, UUID> {
    //    Get All Replies for Specific -> COMMENT (Pagination)
    @Query("SELECT r FROM Reply r WHERE r.comment.id = :commentId")
    Page<Reply> findByCommentId(@Param("commentId") UUID commentId, Pageable pageable);

}