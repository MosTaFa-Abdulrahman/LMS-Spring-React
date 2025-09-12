package com.mostafa.lms_api.model;


import com.mostafa.lms_api.base.BaseEntity;
import com.mostafa.lms_api.enums.CourseLevel;
import com.mostafa.lms_api.enums.CourseStatus;
import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;


@Entity
@Table(name = "courses")
@Builder
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class Course extends BaseEntity<UUID> {
    @Column(nullable = false)
    private String title;

    @Column(name = "description")
    private String description;

    @Column(name = "short_description")
    private String shortDescription;

    @Column(name = "course_img")
    private String courseImg;

    @Column(name = "price")
    @Builder.Default
    private BigDecimal price = BigDecimal.ZERO;


    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    @Builder.Default
    private CourseStatus status = CourseStatus.PUBLISHED;

    @Enumerated(EnumType.STRING)
    private CourseLevel level;

    @Column(name = "estimated_duration")
    @Builder.Default
    private Double estimatedDurationHours = 0.0;

    @Column(name = "is_published")
    @Builder.Default
    private Boolean isPublished = true;


    // Relationships
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user; // for Instructor

    @OneToMany(mappedBy = "course", fetch = FetchType.LAZY,
            cascade = CascadeType.ALL, orphanRemoval = true)
    @OrderBy("sortOrder ASC")
    private List<Section> sections;

    @OneToMany(mappedBy = "course", fetch = FetchType.LAZY,
            cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Progress> progressList;

    @OneToMany(mappedBy = "course", fetch = FetchType.LAZY,
            cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Quiz> quizzes;
}
