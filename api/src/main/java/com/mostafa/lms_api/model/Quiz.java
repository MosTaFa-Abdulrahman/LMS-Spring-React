package com.mostafa.lms_api.model;


import com.mostafa.lms_api.base.BaseEntity;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.time.ZoneId;
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

    @Column(name = "description", columnDefinition = "TEXT")
    private String description;

    @Column(name = "start_time")
    private LocalDateTime startTime;

    @Column(name = "end_time")
    private LocalDateTime endTime;

    // Quiz results - store user's score
    @Column(name = "user_score")
    private Double userScore = 0.0;

    @Column(name = "total_score")
    private Double totalScore = 0.0;


    // Relationships
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "course_id")
    private Course course;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user; // Student who took the quiz

    @OneToMany(mappedBy = "quiz", fetch = FetchType.LAZY,
            cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Question> questions;


    // Helper methods for time management with Egypt timezone
    public static final ZoneId EGYPT_ZONE = ZoneId.of("Africa/Cairo");

    public boolean isActive() {
        ZonedDateTime nowInEgypt = ZonedDateTime.now(EGYPT_ZONE);
        LocalDateTime nowLocal = nowInEgypt.toLocalDateTime();
        return nowLocal.isAfter(startTime) && nowLocal.isBefore(endTime);
    }

    public boolean hasStarted() {
        ZonedDateTime nowInEgypt = ZonedDateTime.now(EGYPT_ZONE);
        LocalDateTime nowLocal = nowInEgypt.toLocalDateTime();
        return nowLocal.isAfter(startTime);
    }

    public boolean hasEnded() {
        ZonedDateTime nowInEgypt = ZonedDateTime.now(EGYPT_ZONE);
        LocalDateTime nowLocal = nowInEgypt.toLocalDateTime();
        return nowLocal.isAfter(endTime);
    }


    // Helper method to check if quiz is completed by user
    public boolean isCompletedByUser() {
        return userScore != null && userScore > 0;
    }


}
