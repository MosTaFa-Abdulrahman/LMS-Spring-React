package com.mostafa.lms_api.repository;

import com.mostafa.lms_api.model.CommentLike;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;


@Repository
public interface CommentLikeRepo extends JpaRepository<CommentLike, UUID> {
    // Check if user already liked the comment
    Optional<CommentLike> findByUserIdAndCommentId(UUID userId, UUID commentId);

    // Count likes for a specific comment
    @Query("SELECT COUNT(cl) FROM CommentLike cl WHERE cl.comment.id = :commentId")
    Long countLikesByCommentId(@Param("commentId") UUID commentId);
}
