package com.mostafa.lms_api.controller;


import com.mostafa.lms_api.dto.auth.LoginRequestDTO;
import com.mostafa.lms_api.dto.auth.LoginResponseDto;
import com.mostafa.lms_api.dto.auth.RegisterRequestDTO;
import com.mostafa.lms_api.dto.user.CurrentUserResponseDTO;
import com.mostafa.lms_api.global.GlobalResponse;
import com.mostafa.lms_api.service.AuthService;
import com.mostafa.lms_api.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.UUID;


@RestController
@RequiredArgsConstructor
@RequestMapping("/api/auth")
public class AuthController {
    private final AuthService authService;
    private final UserService userService;

    @PostMapping("/register")
    public ResponseEntity<GlobalResponse<String>> register(@RequestBody RegisterRequestDTO dto) {
        authService.register(dto);

        return new ResponseEntity<>(new GlobalResponse<>("Registerd Successfully"), HttpStatus.CREATED);
    }

    @PostMapping("/login")
    public ResponseEntity<GlobalResponse<LoginResponseDto>> login(@RequestBody LoginRequestDTO dto) {
        Map<String, Object> loginData = authService.login(dto);

        // Safe casting with proper handling
        LoginResponseDto response = new LoginResponseDto(
                (String) loginData.get("token"),
                (UUID) loginData.get("userId"),
                (String) loginData.get("username"),
                (String) loginData.get("email")
        );

        return new ResponseEntity<>(new GlobalResponse<>(response), HttpStatus.OK);
    }

    @GetMapping("/me")
    public ResponseEntity<GlobalResponse<CurrentUserResponseDTO>> getCurrentUser() {
        CurrentUserResponseDTO currentUserData = userService.getCurrentUserWithEnrollments();
        GlobalResponse<CurrentUserResponseDTO> res = new GlobalResponse<>(currentUserData);

        return new ResponseEntity<>(res, HttpStatus.OK);
    }


//    @GetMapping("/me")
//    public ResponseEntity<GlobalResponse<UserInfoDTO>> getCurrentUser() {
//        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
//
//        if (authentication == null || !authentication.isAuthenticated() ||
//                authentication.getPrincipal().equals("anonymousUser")) {
//            return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
//        }
//
//        // Get user info from authentication
//        User currentUser = (User) authentication.getPrincipal();
//
//        UserInfoDTO userInfo = new UserInfoDTO(
//                currentUser.getId(),
//                currentUser.getUsername(),
//                currentUser.getEmail(),
//                currentUser.getFirstName(),
//                currentUser.getLastName(),
//                currentUser.getPhoneNumber(),
//                currentUser.getFatherPhoneNumber(),
//                currentUser.getProfileImageUrl(),
//                currentUser.getLevel(),
//                currentUser.getRole()
//        );
//
//        return new ResponseEntity<>(new GlobalResponse<>(userInfo), HttpStatus.OK);
//    }

    @PostMapping("/logout")
    public ResponseEntity<GlobalResponse<String>> logout() {
        // Clear security context
        SecurityContextHolder.clearContext();
        return new ResponseEntity<>(new GlobalResponse<>("Logged out successfully"), HttpStatus.OK);
    }


}
