package com.mostafa.lms_api.model;


import com.mostafa.lms_api.base.BaseEntity;
import jakarta.persistence.*;
import lombok.*;

import java.util.UUID;


@Entity
@Table(name = "files")
@Builder
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class File extends BaseEntity<UUID> {
    @Column(nullable = false)
    private String title;

    @Column(name = "file_url", nullable = false)
    private String fileUrl;

    @Column(name = "is_preview")
    @Builder.Default
    private Boolean isPreview = false; // Free preview files

    // ✅ Add this field
    @Column(name = "sort_order")
    private Integer sortOrder;

    // Relationships
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "section_id", nullable = false)
    private Section section;
}
