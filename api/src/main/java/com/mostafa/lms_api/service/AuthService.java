package com.mostafa.lms_api.service;

import com.mostafa.lms_api.config.JwtHelper;
import com.mostafa.lms_api.dto.auth.LoginRequestDTO;
import com.mostafa.lms_api.dto.auth.RegisterRequestDTO;
import com.mostafa.lms_api.global.CustomResponseException;
import com.mostafa.lms_api.model.User;
import com.mostafa.lms_api.repository.UserRepo;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;


@Service
@RequiredArgsConstructor
public class AuthService {
    private final UserRepo userRepo;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtHelper jwtHelper;


    //    Register
    public void register(RegisterRequestDTO dto) {
        User userAccount = new User();

        userAccount.setUsername(dto.username());
        userAccount.setEmail(dto.email());
        userAccount.setPassword(passwordEncoder.encode(dto.password()));
        userAccount.setFirstName(dto.firstName());
        userAccount.setLastName(dto.lastName());
        userAccount.setPhoneNumber(dto.phoneNumber());
        userAccount.setFatherPhoneNumber(dto.fatherPhoneNumber());
        userAccount.setLevel(dto.level());

        userRepo.save(userAccount);
    }

    //    Login
    public Map<String, Object> login(LoginRequestDTO dto) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(dto.email(), dto.password()));

        User user = userRepo.findByEmail(dto.email())
                .orElseThrow(CustomResponseException::BadCredentials);

        Map<String, Object> customClaims = new HashMap<>();
        customClaims.put("userId", user.getId());

        String token = jwtHelper.generateToken(customClaims, user);

        // Prepare response with token and user info
        Map<String, Object> response = new HashMap<>();
        response.put("token", token);
        response.put("userId", user.getId());
        response.put("username", user.getUsername());
        response.put("email", user.getEmail());

        return response;
    }

}
