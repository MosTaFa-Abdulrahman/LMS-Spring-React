package com.mostafa.lms_api.model;


import com.mostafa.lms_api.base.BaseEntity;
import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;


@Entity
@Table(name = "sections")
@Builder
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class Section extends BaseEntity<UUID> {
    @Column(nullable = false)
    private String title;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(name = "price")
    private BigDecimal price;  // **Required* //

    @Column(name = "is_published")
    @Builder.Default
    private Boolean isPublished = true;

    @Column(name = "sort_order")
    private Integer sortOrder; //  (((for Range)))


    // Relationships
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "course_id", nullable = false)
    private Course course;

    @OneToMany(mappedBy = "section", fetch = FetchType.LAZY,
            cascade = CascadeType.ALL, orphanRemoval = true)
    @OrderBy("sortOrder ASC")
    private List<Video> videos;

    @OneToMany(mappedBy = "section", fetch = FetchType.LAZY,
            cascade = CascadeType.ALL, orphanRemoval = true)
    @OrderBy("sortOrder ASC")
    private List<File> files;

    @OneToMany(mappedBy = "section", fetch = FetchType.LAZY,
            cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Enrollment> enrollments;
}
