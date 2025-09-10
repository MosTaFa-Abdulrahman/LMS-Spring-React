package com.mostafa.lms_api.repository;

import com.mostafa.lms_api.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;


@Repository
public interface UserRepo extends JpaRepository<User, UUID> {
    //    Get User By ((email))
    Optional<User> findByEmail(String email);
}
