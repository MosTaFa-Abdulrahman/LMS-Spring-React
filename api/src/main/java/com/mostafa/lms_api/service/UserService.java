package com.mostafa.lms_api.service;

import com.mostafa.lms_api.dto.enrollment.EnrollmentResponseDTO;
import com.mostafa.lms_api.dto.user.CurrentUserResponseDTO;
import com.mostafa.lms_api.dto.user.UpdateUserDTO;
import com.mostafa.lms_api.dto.user.UserInfoDTO;
import com.mostafa.lms_api.dto.user.UserResponseDTO;
import com.mostafa.lms_api.global.CustomResponseException;
import com.mostafa.lms_api.mapper.EntityDtoMapper;
import com.mostafa.lms_api.model.User;
import com.mostafa.lms_api.repository.EnrollmentRepo;
import com.mostafa.lms_api.repository.UserRepo;
import com.mostafa.lms_api.utils.CurrentUser;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;


@Service
@RequiredArgsConstructor
public class UserService {
    private final UserRepo userRepo;
    private final EnrollmentRepo enrollmentRepo;
    private final EntityDtoMapper mapper;
    private final CurrentUser currentUser;


    //    Update
    public UserResponseDTO updateUser(UUID userId, UpdateUserDTO dto) {
        User existingUser = userRepo.findById(userId)
                .orElseThrow(() -> CustomResponseException.ResourceNotFound("User Not Found with This ID:  " + userId));

        existingUser.setFirstName(dto.firstName());
        existingUser.setLastName(dto.lastName());
        existingUser.setPhoneNumber(dto.phoneNumber());
        existingUser.setFatherPhoneNumber(dto.fatherPhoneNumber());
        existingUser.setProfileImageUrl(dto.profileImageUrl());
        existingUser.setLevel(dto.level());
        User updatedUser = userRepo.save(existingUser);

        return mapper.toUserResponseDTO(updatedUser);
    }

    //    Delete ((userId))
    public String deleteByUserId(UUID userId) {
        userRepo.findById(userId)
                .orElseThrow(() -> CustomResponseException.ResourceNotFound("User Not Found with This ID:  " + userId));

        userRepo.deleteById(userId);
        return "User Deleted Success with this ID: " + userId;
    }

    //    Get All
    public Page<UserResponseDTO> getAllUsers(int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<User> usersPage = userRepo.findAll(pageable);

        return usersPage.map(mapper::toUserResponseDTO);
    }

    //    Get By ((userId)
    public UserResponseDTO getByUserId(UUID userId) {
        User user = userRepo.findById(userId)
                .orElseThrow(() -> CustomResponseException.ResourceNotFound("User Not Found with This ID:  " + userId));

        return mapper.toUserResponseDTO(user);
    }


    //  ********************************* ((Specifications)) ******************************** //
    // get currentUser with all -> (Sections Enrollments)
    public CurrentUserResponseDTO getCurrentUserWithEnrollments() {
        User authUser = currentUser.getCurrentUser();

        // Convert User -> UserInfoDTO
        UserInfoDTO userInfo = new UserInfoDTO(
                authUser.getId(),
                authUser.getUsername(),
                authUser.getEmail(),
                authUser.getFirstName(),
                authUser.getLastName(),
                authUser.getPhoneNumber(),
                authUser.getFatherPhoneNumber(),
                authUser.getProfileImageUrl(),
                authUser.getLevel(),
                authUser.getRole()
        );

        // Fetch enrollments (no pagination, or you can add if needed)
        List<EnrollmentResponseDTO> enrollments = enrollmentRepo.findAllByUserIdWithDetails(
                authUser.getId(), Pageable.unpaged()
        ).map(mapper::toEnrollmentResponseDTO).toList();

        return new CurrentUserResponseDTO(userInfo, enrollments);
    }


}
