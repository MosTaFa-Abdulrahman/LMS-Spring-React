package com.mostafa.lms_api.repository;

import com.mostafa.lms_api.model.Choice;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.UUID;


@Repository
public interface ChoiceRepo extends JpaRepository<Choice, UUID> {
}
