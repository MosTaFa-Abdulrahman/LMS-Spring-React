package com.mostafa.lms_api.repository;

import com.mostafa.lms_api.model.Question;
import com.mostafa.lms_api.model.Quiz;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;


@Repository
public interface QuizRepo extends JpaRepository<Quiz, UUID> {
    // Instead of trying to fetch both collections at once
    @Query("SELECT q FROM Quiz q LEFT JOIN FETCH q.questions WHERE q.id = :quizId")
    Optional<Quiz> findByIdWithQuestions(@Param("quizId") UUID quizId);

    // Separate method to fetch question options
    @Query("SELECT q FROM Question q LEFT JOIN FETCH q.options WHERE q.quiz.id = :quizId")
    List<Question> findQuestionsWithOptionsByQuizId(@Param("quizId") UUID quizId);
}
