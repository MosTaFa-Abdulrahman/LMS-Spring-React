package com.mostafa.lms_api.controller;


import com.mostafa.lms_api.dto.PaginatedResponse;
import com.mostafa.lms_api.dto.quiz.CreateQuizDTO;
import com.mostafa.lms_api.dto.quiz.QuizResponseDTO;
import com.mostafa.lms_api.dto.quiz.UpdateQuizDTO;
import com.mostafa.lms_api.global.GlobalResponse;
import com.mostafa.lms_api.service.QuizService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.UUID;


@RestController
@RequiredArgsConstructor
@RequestMapping("/api/quizzes")
public class QuizController {
    private final QuizService quizService;


    //    Create
    @PostMapping
    public ResponseEntity<GlobalResponse<QuizResponseDTO>> createQuiz(
            @Valid @RequestBody CreateQuizDTO dto) {
        QuizResponseDTO createdQuiz = quizService.createQuiz(dto);
        GlobalResponse<QuizResponseDTO> res = new GlobalResponse<>(createdQuiz);

        return new ResponseEntity<>(res, HttpStatus.CREATED);
    }

    //    Update
    @PutMapping("/{quizId}")
    public ResponseEntity<GlobalResponse<QuizResponseDTO>> updateQuiz(
            @Valid @RequestBody UpdateQuizDTO dto,
            @PathVariable UUID quizId) {
        QuizResponseDTO updatedQuiz = quizService.updateQuiz(quizId, dto);
        GlobalResponse<QuizResponseDTO> res = new GlobalResponse<>(updatedQuiz);

        return new ResponseEntity<>(res, HttpStatus.OK);
    }

    //    Delete
    @DeleteMapping("/{quizId}")
    public ResponseEntity<GlobalResponse<String>> deleteQuiz(@PathVariable UUID quizId) {
        String deletedQuiz = quizService.deleteQuiz(quizId);
        GlobalResponse<String> res = new GlobalResponse<>(deletedQuiz);

        return new ResponseEntity<>(res, HttpStatus.OK);
    }

    //    Get Single
    @GetMapping("/{quizId}")
    public ResponseEntity<GlobalResponse<QuizResponseDTO>> getQuiz(@PathVariable UUID quizId) {
        QuizResponseDTO quiz = quizService.getQuizById(quizId);
        GlobalResponse<QuizResponseDTO> res = new GlobalResponse<>(quiz);

        return new ResponseEntity<>(res, HttpStatus.OK);
    }

    //    Get All
    @GetMapping
    public ResponseEntity<GlobalResponse<PaginatedResponse<QuizResponseDTO>>> getAll(
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "10") int size,
            HttpServletRequest req
    ) {
        Page<QuizResponseDTO> quizzes = quizService.getAllQuizzes(page - 1, size);

        String baseUrl = req.getRequestURL().toString();
        String nextUrl = quizzes.hasNext() ? String.format("%s?page=%d&size=%d", baseUrl, page + 1, size) : null;
        String prevUrl = quizzes.hasPrevious() ? String.format("%s?page=%d&size=%d", baseUrl, page - 1, size) : null;

        var paginatedResponse = new PaginatedResponse<QuizResponseDTO>(
                quizzes.getContent(),
                quizzes.getNumber() + 1,
                quizzes.getTotalPages(),
                quizzes.getTotalElements(),
                quizzes.hasNext(),
                quizzes.hasPrevious(),
                nextUrl,
                prevUrl
        );

        return new ResponseEntity<>(new GlobalResponse<>(paginatedResponse), HttpStatus.OK);
    }


    //    Get All For ((Specific-User))
    @GetMapping("/user/{userId}")
    public ResponseEntity<GlobalResponse<List<QuizResponseDTO>>> getAllQuizzes(
            @PathVariable UUID userId) {
        List<QuizResponseDTO> quiz = quizService.getAllQuizzesForUser(userId);
        GlobalResponse<List<QuizResponseDTO>> res = new GlobalResponse<>(quiz);

        return new ResponseEntity<>(res, HttpStatus.OK);
    }

    //    Get All (((Completed))) For ((Specific-User))
    @GetMapping("/user/{userId}/taken")
    public ResponseEntity<GlobalResponse<List<QuizResponseDTO>>> getAllTakenQuizzes(
            @PathVariable UUID userId) {
        List<QuizResponseDTO> quiz = quizService.getTakenQuizzesByUser(userId);
        GlobalResponse<List<QuizResponseDTO>> res = new GlobalResponse<>(quiz);

        return new ResponseEntity<>(res, HttpStatus.OK);
    }


    // ***************************** ((Specifications)) *********************** //
    //    Submit All
    @PostMapping("/{quizId}/submit")
    public ResponseEntity<GlobalResponse<QuizResponseDTO>> submitAnswers(
            @PathVariable UUID quizId, @RequestBody Map<UUID, String> answers) {
        QuizResponseDTO result = quizService.submitAnswers(quizId, answers);
        GlobalResponse<QuizResponseDTO> res = new GlobalResponse<>(result);

        return new ResponseEntity<>(res, HttpStatus.OK);
    }


}
