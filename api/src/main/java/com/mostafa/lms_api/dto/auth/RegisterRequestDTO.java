package com.mostafa.lms_api.dto.auth;

import com.mostafa.lms_api.enums.UserLevel;
import jakarta.validation.constraints.*;


public record RegisterRequestDTO(
        @NotNull(message = "username is required")
        @Size(min = 2, max = 50, message = "min is 2, max is 50")
        String username,

        @NotBlank(message = "Email is required")
        @Email(message = "Email should be valid")
        String email,

        @NotNull(message = "password is required")
        @Size(min = 6, max = 50, message = "min is 6, max is 50")
        String password,

        @NotNull(message = "firstName is required")
        @Size(min = 2, max = 50, message = "min is 2, max is 50")
        String firstName,

        @NotNull(message = "lastName is required")
        @Size(min = 2, max = 50, message = "min is 2, max is 50")
        String lastName,

        @NotNull(message = "phoneNumber is required")
        @Pattern(
                regexp = "^(\\+20)?(10|11|12|15)[0-9]{8}$",
                message = "Phone number must be a valid Egyptian number (e.g. 010XXXXXXXX or +2010XXXXXXXX)"
        )
        String phoneNumber,

        @NotNull(message = "fatherPhoneNumber is required")
        @Pattern(
                regexp = "^(\\+20)?(10|11|12|15)[0-9]{8}$",
                message = "Phone number must be a valid Egyptian number (e.g. 010XXXXXXXX or +2010XXXXXXXX)"
        )
        String fatherPhoneNumber,


        UserLevel level

) {
}
