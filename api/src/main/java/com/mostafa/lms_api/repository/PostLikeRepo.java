package com.mostafa.lms_api.repository;

import com.mostafa.lms_api.model.PostLike;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;


@Repository
public interface PostLikeRepo extends JpaRepository<PostLike, UUID> {
    // Check if user already liked the post
    Optional<PostLike> findByUserIdAndPostId(UUID userId, UUID postId);

    // Count likes for a specific post
    @Query("SELECT COUNT(pl) FROM PostLike pl WHERE pl.post.id = :postId")
    Long countLikesByPostId(@Param("postId") UUID postId);


}
