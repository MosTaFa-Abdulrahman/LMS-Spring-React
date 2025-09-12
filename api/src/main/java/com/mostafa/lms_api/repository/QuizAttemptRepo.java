package com.mostafa.lms_api.repository;

import com.mostafa.lms_api.model.QuizAttempt;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;


@Repository
public interface QuizAttemptRepo extends JpaRepository<QuizAttempt, UUID> {
    boolean existsByUserIdAndQuizId(UUID userId, UUID quizId);

    int countByUserIdAndQuizId(UUID userId, UUID quizId);

    List<QuizAttempt> findCompletedAttemptsByUserId(UUID userId);
}
