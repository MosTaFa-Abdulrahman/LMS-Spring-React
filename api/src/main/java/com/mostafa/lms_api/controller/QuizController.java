package com.mostafa.lms_api.controller;

import com.mostafa.lms_api.dto.PaginatedResponse;
import com.mostafa.lms_api.dto.quiz.create.CreateQuizDTO;
import com.mostafa.lms_api.dto.quiz.get.QuizAttemptResponseDTO;
import com.mostafa.lms_api.dto.quiz.get.QuizResponseDTO;
import com.mostafa.lms_api.dto.quiz.get.QuizSummaryResponseDTO;
import com.mostafa.lms_api.dto.quiz.update.UpdateQuizDTO;
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


    // Create Quiz
    @PostMapping
    public ResponseEntity<GlobalResponse<QuizResponseDTO>> createQuiz(
            @Valid @RequestBody CreateQuizDTO dto) {
        QuizResponseDTO createdQuiz = quizService.createQuiz(dto);
        GlobalResponse<QuizResponseDTO> res = new GlobalResponse<>(createdQuiz);

        return new ResponseEntity<>(res, HttpStatus.CREATED);
    }

    // Update Quiz
    @PutMapping("/{quizId}")
    public ResponseEntity<GlobalResponse<QuizResponseDTO>> updateQuiz(
            @Valid @RequestBody UpdateQuizDTO dto,
            @PathVariable UUID quizId) {
        // Set the ID from path parameter to DTO
        UpdateQuizDTO updatedDto = new UpdateQuizDTO(
                quizId,
                dto.title(),
                dto.description(),
                dto.startTime(),
                dto.endTime(),
                dto.questions()
        );

        QuizResponseDTO updatedQuiz = quizService.updateQuiz(updatedDto);
        GlobalResponse<QuizResponseDTO> res = new GlobalResponse<>(updatedQuiz);

        return new ResponseEntity<>(res, HttpStatus.OK);
    }

    // Delete Quiz
    @DeleteMapping("/{quizId}")
    public ResponseEntity<GlobalResponse<String>> deleteQuiz(@PathVariable UUID quizId) {
        String result = quizService.deleteQuiz(quizId);
        GlobalResponse<String> res = new GlobalResponse<>(result);

        return new ResponseEntity<>(res, HttpStatus.OK);
    }

    // Get All Quizzes
    @GetMapping
    public ResponseEntity<GlobalResponse<PaginatedResponse<QuizSummaryResponseDTO>>> getAll(
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "10") int size,
            HttpServletRequest req
    ) {
        Page<QuizSummaryResponseDTO> quizzes = quizService.getAllQuizzes(page - 1, size);

        String baseUrl = req.getRequestURL().toString();
        String nextUrl = quizzes.hasNext() ? String.format("%s?page=%d&size=%d", baseUrl, page + 1, size) : null;
        String prevUrl = quizzes.hasPrevious() ? String.format("%s?page=%d&size=%d", baseUrl, page - 1, size) : null;

        var paginatedResponse = new PaginatedResponse<QuizSummaryResponseDTO>(
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

    // Get Single Quiz for ((update))
    @GetMapping("/{quizId}")
    public ResponseEntity<GlobalResponse<QuizResponseDTO>> getSingleQuiz(@PathVariable UUID quizId) {
        QuizResponseDTO quiz = quizService.getSingleForUpdate(quizId);
        GlobalResponse<QuizResponseDTO> res = new GlobalResponse<>(quiz);

        return new ResponseEntity<>(res, HttpStatus.OK);
    }

    // Get Single Quiz for Student (to take quiz)
    @GetMapping("/{quizId}/take")
    public ResponseEntity<GlobalResponse<QuizResponseDTO>> getQuizForStudent(@PathVariable UUID quizId) {
        QuizResponseDTO quiz = quizService.getQuizForStudent(quizId);
        GlobalResponse<QuizResponseDTO> res = new GlobalResponse<>(quiz);

        return new ResponseEntity<>(res, HttpStatus.OK);
    }

    // Submit Quiz Answers
    @PostMapping("/{quizId}/submit")
    public ResponseEntity<GlobalResponse<QuizAttemptResponseDTO>> submitQuizAnswers(
            @PathVariable UUID quizId,
            @Valid @RequestBody Map<UUID, UUID> questionAnswerMap) {
        QuizAttemptResponseDTO attempt = quizService.submitQuizAnswers(quizId, questionAnswerMap);
        GlobalResponse<QuizAttemptResponseDTO> res = new GlobalResponse<>(attempt);

        return new ResponseEntity<>(res, HttpStatus.OK);
    }

    // ***************************** ((User Quiz Results)) *********************** //

    // Get Finished Quizzes for Current User
    @GetMapping("/my-attempts")
    public ResponseEntity<GlobalResponse<List<QuizAttemptResponseDTO>>> getMyFinishedQuizzes() {
        List<QuizAttemptResponseDTO> attempts = quizService.getFinishedQuizzesForUser();
        GlobalResponse<List<QuizAttemptResponseDTO>> res = new GlobalResponse<>(attempts);

        return new ResponseEntity<>(res, HttpStatus.OK);
    }

    // Get Finished Quizzes for Specific User (Admin/Instructor use)
    @GetMapping("/user/{userId}/attempts")
    public ResponseEntity<GlobalResponse<List<QuizAttemptResponseDTO>>> getFinishedQuizzesForUser(
            @PathVariable UUID userId) {
        List<QuizAttemptResponseDTO> attempts = quizService.getFinishedQuizzesForUser(userId);
        GlobalResponse<List<QuizAttemptResponseDTO>> res = new GlobalResponse<>(attempts);

        return new ResponseEntity<>(res, HttpStatus.OK);
    }


}