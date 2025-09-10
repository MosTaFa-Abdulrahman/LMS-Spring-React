package com.mostafa.lms_api.repository;

import com.mostafa.lms_api.model.Quiz;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;


@Repository
public interface QuizRepo extends JpaRepository<Quiz, UUID> {
    // Find all quizzes by user ID
    List<Quiz> findByUserId(UUID userId);

    // Find all quizzes that a user has taken (completed)
    @Query("SELECT q FROM Quiz q WHERE q.user.id = :userId AND q.userScore > 0")
    List<Quiz> findTakenQuizzesByUserId(@Param("userId") UUID userId);
}
