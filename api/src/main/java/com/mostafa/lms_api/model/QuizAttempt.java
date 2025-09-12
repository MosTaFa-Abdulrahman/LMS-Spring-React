package com.mostafa.lms_api.model;

import com.mostafa.lms_api.base.BaseEntity;
import jakarta.persistence.*;
import lombok.*;

import java.time.ZonedDateTime;
import java.util.List;
import java.util.UUID;


@Entity
@Table(name = "quiz_attempts",
        uniqueConstraints = @UniqueConstraint(columnNames = {"user_id", "quiz_id", "attempt_number"}))
@Builder
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class QuizAttempt extends BaseEntity<UUID> {
    @Column(name = "attempt_number", nullable = false)
    private Integer attemptNumber; // 1, 2, 3... based on maxAttempts

    @Column(name = "started_at", nullable = false)
    private ZonedDateTime startedAt; // Egypt timezone

    @Column(name = "completed_at")
    private ZonedDateTime completedAt; // Egypt timezone

    @Column(name = "total_score")
    @Builder.Default
    private Double totalScore = 0.0; // Total points earned in this attempt

    @Column(name = "is_completed")
    @Builder.Default
    private Boolean isCompleted = false;


    // Relationships
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user; // Student taking the quiz

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "quiz_id", nullable = false)
    private Quiz quiz; // Quiz being attempted

    @OneToMany(mappedBy = "quizAttempt", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<UserAnswer> userAnswers; // All answers for this attempt
}
