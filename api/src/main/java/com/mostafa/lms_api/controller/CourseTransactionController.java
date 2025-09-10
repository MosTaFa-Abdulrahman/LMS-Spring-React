package com.mostafa.lms_api.controller;


import com.mostafa.lms_api.dto.transaction.request.CreateCourseTransaction;
import com.mostafa.lms_api.dto.transaction.response.CourseTransactionResponseDTO;
import com.mostafa.lms_api.global.GlobalResponse;
import com.mostafa.lms_api.service.CourseTransactionService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/courses/transaction")
public class CourseTransactionController {
    private final CourseTransactionService courseTransactionService;


    //    Create
    @PostMapping
    public ResponseEntity<GlobalResponse<CourseTransactionResponseDTO>> createCourse(
            @Valid @RequestBody CreateCourseTransaction dto) {
        CourseTransactionResponseDTO createdCourse = courseTransactionService.createCourse(dto);
        GlobalResponse<CourseTransactionResponseDTO> res = new GlobalResponse<>(createdCourse);

        return new ResponseEntity<>(res, HttpStatus.CREATED);
    }


}
