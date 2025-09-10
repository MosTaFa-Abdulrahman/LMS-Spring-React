package com.mostafa.lms_api.config;


import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.List;


@Configuration
@EnableWebSecurity
@EnableMethodSecurity
@RequiredArgsConstructor
public class SecurityConfig {
    private final UserDetailsService userDetailsService;
    private final JwtAuthFilter jwtAuthFilter;

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }


    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .cors(c -> {
                    CorsConfigurationSource source = corsConfigurationSource();
                    c.configurationSource(source);
                })
                .csrf(AbstractHttpConfigurer::disable)
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .authorizeHttpRequests(auth -> {
                    auth.requestMatchers(
                                    "/api/auth/register",
                                    "/api/auth/login").permitAll()
                            // Swagger/OpenAPI endpoints
                            .requestMatchers(
                                    "/swagger-ui/**",
                                    "/swagger-ui.html",
                                    "/api-docs/**",
                                    "/v3/api-docs/**",
                                    "/swagger-resources/**",
                                    "/webjars/**")
                            .permitAll()
                            // logout/me
                            .requestMatchers(HttpMethod.GET, "/api/auth/me").authenticated()
                            .requestMatchers(HttpMethod.POST, "/api/auth/logout").authenticated()
                            //  ((Users))  //
                            .requestMatchers(HttpMethod.PUT, "/api/users/{userId}").authenticated()
                            .requestMatchers(HttpMethod.DELETE, "/api/users/{userId}").authenticated()
                            .requestMatchers(HttpMethod.GET, "/api/users").hasAnyRole("ADMIN", "INSTRUCTOR")
                            .requestMatchers(HttpMethod.GET, "/api/users/{userId}").authenticated()
                            .requestMatchers(HttpMethod.POST, "/api/users/follow/{followingId}").authenticated()
                            .requestMatchers(HttpMethod.DELETE, "/api/users/unfollow/{followingId}").authenticated()
                            .requestMatchers(HttpMethod.GET, "/api/users/{userId}/followers/count").authenticated()
                            .requestMatchers(HttpMethod.GET, "/api/users/{userId}/followings/count").authenticated()
                            .requestMatchers(HttpMethod.GET, "/api/users/{userId}/followers").authenticated()
                            .requestMatchers(HttpMethod.GET, "/api/users/{userId}/followings").authenticated()
                            //  ((Courses))  //
                            .requestMatchers(HttpMethod.POST, "/api/courses").hasAnyRole("ADMIN", "INSTRUCTOR")
                            .requestMatchers(HttpMethod.PUT, "/api/courses/{courseId}").hasAnyRole("ADMIN", "INSTRUCTOR")
                            .requestMatchers(HttpMethod.DELETE, "/api/courses/{courseId}").hasAnyRole("ADMIN", "INSTRUCTOR")
                            .requestMatchers(HttpMethod.GET, "/api/courses").authenticated()
                            .requestMatchers(HttpMethod.GET, "/api/courses/search").authenticated()
                            .requestMatchers(HttpMethod.GET, "/api/courses/{courseId}").authenticated()
//                            Create Course Transactional
                            .requestMatchers(HttpMethod.POST, "/api/courses/transaction").hasAnyRole("ADMIN", "INSTRUCTOR")


                            //  ((Sections))  //
                            .requestMatchers(HttpMethod.POST, "/api/sections").hasAnyRole("ADMIN", "INSTRUCTOR")
                            .requestMatchers(HttpMethod.PUT, "/api/sections/{sectionId}").hasAnyRole("ADMIN", "INSTRUCTOR")
                            .requestMatchers(HttpMethod.DELETE, "/api/sections/{sectionId}").hasAnyRole("ADMIN", "INSTRUCTOR")
                            .requestMatchers(HttpMethod.GET, "/api/sections/course/{courseId}").authenticated()
                            //  ((Videos))  //
                            .requestMatchers(HttpMethod.POST, "/api/videos").hasAnyRole("ADMIN", "INSTRUCTOR")
                            .requestMatchers(HttpMethod.PUT, "/api/videos/{videoId}").hasAnyRole("ADMIN", "INSTRUCTOR")
                            .requestMatchers(HttpMethod.DELETE, "/api/videos/{videoId}").hasAnyRole("ADMIN", "INSTRUCTOR")
                            .requestMatchers(HttpMethod.GET, "/api/videos/section/{sectionId}").authenticated()
                            //  ((Files))  //
                            .requestMatchers(HttpMethod.POST, "/api/files").hasAnyRole("ADMIN", "INSTRUCTOR")
                            .requestMatchers(HttpMethod.PUT, "/api/files/{fileId}").hasAnyRole("ADMIN", "INSTRUCTOR")
                            .requestMatchers(HttpMethod.DELETE, "/api/files/{fileId}").hasAnyRole("ADMIN", "INSTRUCTOR")
                            .requestMatchers(HttpMethod.GET, "/api/files/section/{sectionId}").authenticated()

                            //  ((Progress))  //
//                            Create OR Update
                            .requestMatchers(HttpMethod.PUT, "/api/progress/videos/{videoId}").hasAnyRole("USER", "INSTRUCTOR")
//                              Course-Progress
                            .requestMatchers(HttpMethod.GET, "/api/progress/videos/{videoId}").hasAnyRole("USER", "INSTRUCTOR")
                            .requestMatchers(HttpMethod.GET, "/api/progress/courses/{courseId}").hasAnyRole("ADMIN", "USER", "INSTRUCTOR")
//                            User-Progress
                            .requestMatchers(HttpMethod.GET, "/api/progress/my-progress").authenticated()
//                            Mark Video-Completed
                            .requestMatchers(HttpMethod.PATCH, "/api/progress/videos/{videoId}/complete").authenticated()
//                            Instructor Analytics
                            .requestMatchers(HttpMethod.GET, "/api/progress/courses/{courseId}/analytics").hasAnyRole("INSTRUCTOR", "ADMIN")
                            .requestMatchers(HttpMethod.GET, "/api/progress/courses/{courseId}/completed-users").hasAnyRole("INSTRUCTOR", "ADMIN")

                            //  ((Enrollments))  //
                            .requestMatchers(HttpMethod.POST, "/api/enrollments").hasAnyRole("USER", "INSTRUCTOR", "ADMIN")
                            .requestMatchers(HttpMethod.GET, "/api/enrollments/user/{userId}").authenticated()
                            .requestMatchers(HttpMethod.GET, "/api/enrollments/section/{sectionId}").authenticated()
                            //  ((Quizzes))  //
                            .requestMatchers(HttpMethod.POST, "/api/quizzes").hasAnyRole("ADMIN", "INSTRUCTOR")
                            .requestMatchers(HttpMethod.PUT, "/api/quizzes/{quizId}").hasAnyRole("ADMIN", "INSTRUCTOR")
                            .requestMatchers(HttpMethod.DELETE, "/api/quizzes/{quizId}").hasAnyRole("ADMIN", "INSTRUCTOR")
                            .requestMatchers(HttpMethod.GET, "/api/quizzes").authenticated()
                            .requestMatchers(HttpMethod.GET, "/api/quizzes/{quizId}").authenticated()
                            .requestMatchers(HttpMethod.GET, "/api/quizzes/user/{userId}").authenticated()
                            .requestMatchers(HttpMethod.GET, "/api/quizzes/user/{userId}/taken").authenticated()
                            .requestMatchers(HttpMethod.POST, "/api/quizzes/{quizId}/submit").authenticated()
                            .anyRequest()
                            .authenticated();

                })
                .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class)
                .authenticationManager(authenticationManager(http));

        return http.build();
    }


    @Bean
    AuthenticationManager authenticationManager(HttpSecurity http) throws Exception {
        var authBuilder = http.getSharedObject(AuthenticationManagerBuilder.class);
        authBuilder.userDetailsService(userDetailsService).passwordEncoder(passwordEncoder());

        return authBuilder.build();
    }


    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOrigins(List.of("http://localhost:5173", "http://localhost:3000"));
        configuration.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"));
        configuration.setAllowedHeaders(List.of("*"));
        configuration.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }


}