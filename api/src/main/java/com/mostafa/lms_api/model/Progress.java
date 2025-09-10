package com.mostafa.lms_api.model;


import com.mostafa.lms_api.base.BaseEntity;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.UUID;


@Entity
@Table(name = "progress",
        uniqueConstraints = @UniqueConstraint(columnNames = {"user_id", "course_id", "video_id"}))
@Builder
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class Progress extends BaseEntity<UUID> {
    @Column(name = "watch_duration_seconds")
    private Integer watchDurationSeconds = 0;

    @Column(name = "completion_percentage")
    @Builder.Default
    private Double completionPercentage = 0.0;

    @Column(name = "is_completed")
    @Builder.Default
    private Boolean isCompleted = false;

    @Column(name = "last_watched_at")
    private LocalDateTime lastWatchedAt;


    // Relationships
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "course_id", nullable = false)
    private Course course;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "video_id", nullable = false)
    private Video video;
}
