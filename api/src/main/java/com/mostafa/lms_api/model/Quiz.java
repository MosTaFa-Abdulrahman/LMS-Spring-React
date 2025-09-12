package com.mostafa.lms_api.model;

import com.mostafa.lms_api.base.BaseEntity;
import jakarta.persistence.*;
import lombok.*;

import java.time.ZonedDateTime;
import java.util.List;
import java.util.UUID;


@Entity
@Table(name = "quizzes")
@Builder
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class Quiz extends BaseEntity<UUID> {
    @Column(name = "title", nullable = false)
    private String title;

    @Column(name = "description", nullable = false)
    private String description;

    @Column(name = "start_time", nullable = false)
    private ZonedDateTime startTime; // Egypt timezone

    @Column(name = "end_time", nullable = false)
    private ZonedDateTime endTime; // Egypt timezone

    @Column(name = "max_attempts")
    @Builder.Default
    private Integer maxAttempts = 1; // User can take quiz only once


    // Relationships
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "course_id", nullable = false)
    private Course course;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user; // Instructor who created the quiz

    @OneToMany(mappedBy = "quiz", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Question> questions;

    @OneToMany(mappedBy = "quiz", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<QuizAttempt> quizAttempts; // All attempts for this quiz
}
