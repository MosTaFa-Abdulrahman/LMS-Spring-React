package com.mostafa.lms_api.model;

import com.mostafa.lms_api.base.BaseEntity;
import jakarta.persistence.*;
import lombok.*;

import java.util.List;
import java.util.UUID;


@Entity
@Table(name = "questions")
@Builder
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class Question extends BaseEntity<UUID> {
    @Column(name = "text", nullable = false)
    private String text;

    @Column(name = "question_image")
    private String questionImage;

    @Column(name = "user_answer")
    private String userAnswer; // Student's selected answer

    @Column(name = "points")
    private Double points;


    // Relationships
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "quiz_id", nullable = false)
    private Quiz quiz;

    @OneToMany(mappedBy = "question", fetch = FetchType.LAZY,
            cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Choice> choices;


    // Helper method to get correct answer label
    public String getCorrectAnswerLabel() {
        if (choices == null || choices.isEmpty()) {
            return null;
        }
        return choices.stream()
                .filter(Choice::getIsCorrect)
                .findFirst()
                .map(Choice::getChoiceLabel)
                .orElse(null);
    }
    
    // Helper method to check if user answer is correct
    public boolean isUserAnswerCorrect() {
        if (userAnswer == null || userAnswer.trim().isEmpty()) {
            return false;
        }
        String correctLabel = getCorrectAnswerLabel();
        return userAnswer.trim().equalsIgnoreCase(correctLabel);
    }


}
