package com.mostafa.lms_api.model;

import com.mostafa.lms_api.base.BaseEntity;
import com.mostafa.lms_api.enums.EnrollmentStatus;
import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.util.UUID;


@Entity
@Table(name = "enrollments",
        uniqueConstraints = @UniqueConstraint(columnNames = {"user_id", "section_id"}))
@Builder
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class Enrollment extends BaseEntity<UUID> {
    @Column(name = "amount_paid")
    private BigDecimal amountPaid;


    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false)
    @Builder.Default
    private EnrollmentStatus status = EnrollmentStatus.ACTIVE;


    // Relationships
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "section_id", nullable = false)
    private Section section;
}
