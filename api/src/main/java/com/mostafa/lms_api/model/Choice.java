package com.mostafa.lms_api.model;


import com.mostafa.lms_api.base.BaseEntity;
import jakarta.persistence.*;
import lombok.*;

import java.util.UUID;


@Entity
@Table(name = "choices",
        uniqueConstraints = {
                @UniqueConstraint(columnNames = {"question_id", "choice_label"})
        })
@Builder
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class Choice extends BaseEntity<UUID> {
    @Column(name = "choice_text", nullable = false, columnDefinition = "TEXT")
    private String choiceText;

    @Column(name = "choice_label", nullable = false, length = 1)
    private String choiceLabel; // A, B, C, D, E, F

    @Column(name = "is_correct", nullable = false)
    private Boolean isCorrect = false;


    // Relationships
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "question_id", nullable = false)
    private Question question;
    

}
