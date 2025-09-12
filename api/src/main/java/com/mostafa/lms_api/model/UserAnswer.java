package com.mostafa.lms_api.model;

import com.mostafa.lms_api.base.BaseEntity;
import jakarta.persistence.*;
import lombok.*;

import java.time.ZonedDateTime;
import java.util.UUID;


@Entity
@Table(name = "user_answers",
        uniqueConstraints = @UniqueConstraint(columnNames = {"quiz_attempt_id", "question_id"}))
@Builder
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class UserAnswer extends BaseEntity<UUID> {
    @Column(name = "answered_at", nullable = false)
    private ZonedDateTime answeredAt; // Egypt timezone

    @Column(name = "is_correct")
    private Boolean isCorrect; // Calculated when answer is submitted

    @Column(name = "points_earned")
    @Builder.Default
    private Double pointsEarned = 0.0; // Points earned for this answer


    // Relationships
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user; // Student who answered

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "question_id", nullable = false)
    private Question question; // Question being answered

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "selected_option_id", nullable = false)
    private QuestionOption selectedOption; // User's selected answer

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "quiz_attempt_id", nullable = false)
    private QuizAttempt quizAttempt; // Links to quiz attempt session
}
