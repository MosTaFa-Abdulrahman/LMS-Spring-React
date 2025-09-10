package com.mostafa.lms_api;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;


@SpringBootApplication
@EnableJpaAuditing(auditorAwareRef = "auditorAwareImpl")
public class LmsApiApplication {
    public static void main(String[] args) {
        SpringApplication.run(LmsApiApplication.class, args);
    }

    
}
