package com.mostafa.lms_api.repository;

import com.mostafa.lms_api.model.ReplyLike;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;


@Repository
public interface ReplyLikeRepo extends JpaRepository<ReplyLike, UUID> {
    // Check if user already liked the reply
    Optional<ReplyLike> findByUserIdAndReplyId(UUID userId, UUID replyId);

    // Count likes for a specific reply
    @Query("SELECT COUNT(rl) FROM ReplyLike rl WHERE rl.reply.id = :replyId")
    Long countLikesByReplyId(@Param("replyId") UUID replyId);


}