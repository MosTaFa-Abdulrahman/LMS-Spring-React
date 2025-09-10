package com.mostafa.lms_api.model;


import com.mostafa.lms_api.base.BaseEntity;
import jakarta.persistence.*;
import lombok.*;

import java.util.List;
import java.util.UUID;


@Entity
@Table(name = "videos")
@Builder
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class Video extends BaseEntity<UUID> {
    @Column(nullable = false)
    private String title;

    @Column(name = "video_url", nullable = false)
    private String videoUrl;

    @Column(name = "is_preview")
    @Builder.Default
    private Boolean isPreview = false; // Free preview videos 😉

    @Column(name = "duration_seconds")
    private Integer durationSeconds;  // focus fill it right in React.js 😎

    @Column(name = "sort_order")
    private Integer sortOrder;


    // Relationships
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "section_id", nullable = false)
    private Section section;

    @OneToMany(mappedBy = "video", fetch = FetchType.LAZY,
            cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Progress> progressList;
}
