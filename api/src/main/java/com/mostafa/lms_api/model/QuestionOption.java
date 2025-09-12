package com.mostafa.lms_api.model;

import com.mostafa.lms_api.base.BaseEntity;
import jakarta.persistence.*;
import lombok.*;

import java.util.List;
import java.util.UUID;


@Entity
@Table(name = "question_options")
@Builder
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class QuestionOption extends BaseEntity<UUID> {
    @Column(name = "option_text", nullable = false)
    private String optionText;

    @Column(name = "option_select", nullable = false)
    private String optionSelect; // A, B, C, D select

    @Column(name = "is_correct", nullable = false)
    @Builder.Default
    private Boolean isCorrect = false;


    // Relationships
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "question_id", nullable = false)
    private Question question;

    @OneToMany(mappedBy = "selectedOption", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<UserAnswer> userAnswers;
}
