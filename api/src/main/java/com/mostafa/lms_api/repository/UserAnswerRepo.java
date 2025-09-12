package com.mostafa.lms_api.repository;

import com.mostafa.lms_api.model.UserAnswer;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.UUID;


@Repository
public interface UserAnswerRepo extends JpaRepository<UserAnswer, UUID> {
}
