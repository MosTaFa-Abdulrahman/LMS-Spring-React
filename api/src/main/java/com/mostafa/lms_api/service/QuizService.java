package com.mostafa.lms_api.service;

import com.mostafa.lms_api.dto.quiz.create.CreateQuizDTO;
import com.mostafa.lms_api.dto.quiz.get.QuizAttemptResponseDTO;
import com.mostafa.lms_api.dto.quiz.get.QuizResponseDTO;
import com.mostafa.lms_api.dto.quiz.get.QuizSummaryResponseDTO;
import com.mostafa.lms_api.dto.quiz.update.UpdateQuizDTO;
import com.mostafa.lms_api.global.CustomResponseException;
import com.mostafa.lms_api.mapper.EntityDtoMapper;
import com.mostafa.lms_api.model.*;
import com.mostafa.lms_api.repository.*;
import com.mostafa.lms_api.utils.CurrentUser;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.ZonedDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.stream.Collectors;


@Service
@RequiredArgsConstructor
public class QuizService {
    private final QuizRepo quizRepo;
    private final QuizAttemptRepo quizAttemptRepo;
    private final UserAnswerRepo userAnswerRepo;
    private final CourseRepo courseRepo;
    private final UserRepo userRepo;
    private final CurrentUser currentUser;
    private final EntityDtoMapper mapper;


    // ====================== CREATE QUIZ ======================
    @Transactional
    public QuizResponseDTO createQuiz(CreateQuizDTO createQuizDTO) {
        // Validate time constraints
        validateQuizTimes(createQuizDTO.startTime(), createQuizDTO.endTime());

        // Get course and validate ownership
        Course course = courseRepo.findById(createQuizDTO.courseId())
                .orElseThrow(() -> CustomResponseException.ResourceNotFound("Course not found with ID: " + createQuizDTO.courseId()));

        User authUser = currentUser.getCurrentUser();

        // Validate questions have at least one correct answer
        validateQuestions(createQuizDTO.questions());

        // Create and save quiz
        Quiz quiz = mapper.toQuizEntity(createQuizDTO, course, authUser);
        Quiz savedQuiz = quizRepo.save(quiz);

        return mapper.toQuizResponseDTO(savedQuiz, false);
    }

    // ====================== UPDATE QUIZ ======================
    @Transactional
    public QuizResponseDTO updateQuiz(UpdateQuizDTO updateQuizDTO) {

        // Get existing quiz and validate ownership
        Quiz existingQuiz = quizRepo.findById(updateQuizDTO.id())
                .orElseThrow(() -> CustomResponseException.ResourceNotFound("Quiz not found with ID: " + updateQuizDTO.id()));

        // Check if quiz has already started
        if (existingQuiz.getStartTime().isBefore(ZonedDateTime.now())) {
            throw CustomResponseException.BadRequest("Cannot update quiz that has already started");
        }

        // Validate time constraints
        validateQuizTimes(updateQuizDTO.startTime(), updateQuizDTO.endTime());

        // Validate questions have at least one correct answer
        validateUpdateQuestions(updateQuizDTO.questions());

        // Update quiz
        Quiz updatedQuiz = mapper.updateQuizFromDTO(existingQuiz, updateQuizDTO);
        Quiz savedQuiz = quizRepo.save(updatedQuiz);

        return mapper.toQuizResponseDTO(savedQuiz, false);
    }

    // ====================== DELETE QUIZ ======================
    @Transactional
    public String deleteQuiz(UUID quizId) {
        Quiz quiz = quizRepo.findById(quizId)
                .orElseThrow(() -> CustomResponseException.ResourceNotFound("Quiz not found with ID: " + quizId));

        quizRepo.delete(quiz);

        return "Quiz deleted successfully";
    }

    // ====================== GET ALL QUIZZES WITH STATUS CHECK ======================
    public Page<QuizSummaryResponseDTO> getAllQuizzes(int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<Quiz> quizzesPage = quizRepo.findAll(pageable);

        // Convert Page<Quiz> to Page<QuizSummaryResponseDTO>
        return quizzesPage.map(mapper::toQuizSummaryResponseDTO);
    }

    // ====================== GET SINGLE QUIZ For Update ======================
    public QuizResponseDTO getSingleForUpdate(UUID quizId) {
        Quiz quiz = quizRepo.findById(quizId)
                .orElseThrow(() -> CustomResponseException.ResourceNotFound("Quiz not found with ID: " + quizId));

        return mapper.toQuizResponseDTO(quiz, false);
    }

    // ====================== GET SINGLE QUIZ WITH STATUS CHECK ======================
    @Transactional
    public QuizResponseDTO getQuizForStudent(UUID quizId) {
        Quiz quiz = quizRepo.findById(quizId)
                .orElseThrow(() -> CustomResponseException.ResourceNotFound("Quiz not found with ID: " + quizId));

        User authUser = currentUser.getCurrentUser();
        ZonedDateTime now = ZonedDateTime.now();

        // Check if user has already taken this quiz
        boolean hasAnyAttempt = quizAttemptRepo.existsByUserIdAndQuizId(authUser.getId(), quizId);

        if (hasAnyAttempt) {
            throw CustomResponseException.BadRequest("You have already taken this quiz 😉");
        }

        // Check if quiz has expired - CREATE SCORE 0 HERE ONLY
        if (now.isAfter(quiz.getEndTime())) {
            // Create automatic failed attempt with score 0 for THIS quiz only
            QuizAttempt expiredAttempt = QuizAttempt.builder()
                    .attemptNumber(1)
                    .startedAt(quiz.getEndTime())
                    .completedAt(quiz.getEndTime())
                    .totalScore(0.0)
                    .isCompleted(true)
                    .user(authUser)
                    .quiz(quiz)
                    .userAnswers(new ArrayList<>())
                    .build();

            quizAttemptRepo.save(expiredAttempt);

            throw CustomResponseException.BadRequest("You cannot take this quiz - time has finished");
        }

        // Check if quiz hasn't started yet
        if (now.isBefore(quiz.getStartTime())) {
            throw CustomResponseException.BadRequest("Quiz has not started yet 🥰😎🤗");
        }

        // Return quiz without correct answers for active quiz
        return mapper.toQuizResponseDTO(quiz, true);
    }

    // ====================== GET FINISHED QUIZZES FOR CURRENT USER WITH SCORES ======================
    public List<QuizAttemptResponseDTO> getFinishedQuizzesForUser() {
        User authUser = currentUser.getCurrentUser();

        List<QuizAttempt> completedAttempts = quizAttemptRepo.findCompletedAttemptsByUserId(authUser.getId());

        return completedAttempts.stream()
                .map(mapper::mapToQuizAttemptResponseDTO)
                .collect(Collectors.toList());
    }

    // ====================== GET FINISHED QUIZZES FOR SPECIFIC USER WITH SCORES (Admin/Instructor use) ======================
    public List<QuizAttemptResponseDTO> getFinishedQuizzesForUser(UUID userId) {
        User user = userRepo.findById(userId)
                .orElseThrow(() -> CustomResponseException.ResourceNotFound("User not found with ID: " + userId));

        List<QuizAttempt> completedAttempts = quizAttemptRepo.findCompletedAttemptsByUserId(user.getId());

        return completedAttempts.stream()
                .map(mapper::mapToQuizAttemptResponseDTO)
                .collect(Collectors.toList());
    }

    // ====================== SUBMIT QUIZ ANSWERS ======================
    @Transactional
    public QuizAttemptResponseDTO submitQuizAnswers(UUID quizId, Map<UUID, UUID> questionAnswerMap) {
        User authUser = currentUser.getCurrentUser();

        // Get quiz with questions only
        Quiz quiz = quizRepo.findByIdWithQuestions(quizId)
                .orElseThrow(() -> CustomResponseException.ResourceNotFound("Quiz not found with ID: " + quizId));

        // Fetch questions with options separately and create a lookup map
        List<Question> questionsWithOptions = quizRepo.findQuestionsWithOptionsByQuizId(quizId);
        Map<UUID, List<QuestionOption>> questionOptionsMap = questionsWithOptions.stream()
                .collect(Collectors.toMap(Question::getId, Question::getOptions));

        // Check if quiz is available for submission
        ZonedDateTime now = ZonedDateTime.now();
        if (now.isBefore(quiz.getStartTime()) || now.isAfter(quiz.getEndTime())) {
            throw CustomResponseException.BadRequest("Quiz is not available for submission");
        }

        // Rest of validation code...
        int userAttempts = quizAttemptRepo.countByUserIdAndQuizId(authUser.getId(), quizId);
        if (userAttempts >= quiz.getMaxAttempts()) {
            throw CustomResponseException.BadRequest("You have exceeded the maximum number of attempts");
        }

        List<UUID> quizQuestionIds = quiz.getQuestions().stream()
                .map(Question::getId)
                .collect(Collectors.toList());

        if (!questionAnswerMap.keySet().containsAll(quizQuestionIds)) {
            throw CustomResponseException.BadRequest("All questions must be answered");
        }

        // Create quiz attempt
        QuizAttempt quizAttempt = QuizAttempt.builder()
                .attemptNumber(userAttempts + 1)
                .startedAt(now)
                .completedAt(now)
                .totalScore(0.0)
                .isCompleted(true)
                .user(authUser)
                .quiz(quiz)
                .userAnswers(new ArrayList<>())
                .build();

        QuizAttempt savedAttempt = quizAttemptRepo.save(quizAttempt);

        // Process answers and calculate score
        double totalScore = 0.0;
        List<UserAnswer> userAnswers = new ArrayList<>();

        for (Question question : quiz.getQuestions()) {
            UUID selectedOptionId = questionAnswerMap.get(question.getId());

            if (selectedOptionId == null) {
                throw CustomResponseException.BadRequest("Answer required for question: " + question.getId());
            }

            // Get options from our map instead of from the question entity
            List<QuestionOption> options = questionOptionsMap.get(question.getId());
            if (options == null) {
                throw CustomResponseException.BadRequest("Question options not found for question: " + question.getId());
            }

            // Validate option belongs to question
            QuestionOption selectedOption = options.stream()
                    .filter(option -> option.getId().equals(selectedOptionId))
                    .findFirst()
                    .orElseThrow(() -> CustomResponseException.BadRequest("Invalid option selected for question: " + question.getId()));

            // Calculate points
            boolean isCorrect = selectedOption.getIsCorrect();
            double pointsEarned = isCorrect ? question.getPoints() : 0.0;
            totalScore += pointsEarned;

            // Create user answer
            UserAnswer userAnswer = UserAnswer.builder()
                    .answeredAt(now)
                    .isCorrect(isCorrect)
                    .pointsEarned(pointsEarned)
                    .user(authUser)
                    .question(question)
                    .selectedOption(selectedOption)
                    .quizAttempt(savedAttempt)
                    .build();

            userAnswers.add(userAnswer);
        }

        // Save all user answers
        List<UserAnswer> savedUserAnswers = userAnswerRepo.saveAll(userAnswers);

        // Update attempt with total score and user answers
        savedAttempt.setTotalScore(totalScore);
        savedAttempt.setUserAnswers(savedUserAnswers);
        QuizAttempt finalAttempt = quizAttemptRepo.save(savedAttempt);

        return mapper.mapToQuizAttemptResponseDTO(finalAttempt);
    }


    // ====================== PRIVATE HELPER METHODS ======================
    private void validateQuizTimes(ZonedDateTime startTime, ZonedDateTime endTime) {
        if (startTime.isAfter(endTime)) {
            throw CustomResponseException.BadRequest("Start time must be before end time");
        }

        if (startTime.isBefore(ZonedDateTime.now().minusMinutes(5))) {
            throw CustomResponseException.BadRequest("Start time cannot be in the past");
        }
    }

    private void validateQuestions(List<com.mostafa.lms_api.dto.quiz.create.CreateQuestionDTO> questions) {
        for (var question : questions) {
            boolean hasCorrectAnswer = question.options().stream()
                    .anyMatch(com.mostafa.lms_api.dto.quiz.create.CreateQuestionOptionDTO::isCorrect);

            if (!hasCorrectAnswer) {
                throw CustomResponseException.BadRequest("Each question must have at least one correct answer");
            }
        }
    }

    private void validateUpdateQuestions(List<com.mostafa.lms_api.dto.quiz.update.UpdateQuestionDTO> questions) {
        for (var question : questions) {
            boolean hasCorrectAnswer = question.options().stream()
                    .anyMatch(com.mostafa.lms_api.dto.quiz.update.UpdateQuestionOptionDTO::isCorrect);

            if (!hasCorrectAnswer) {
                throw CustomResponseException.BadRequest("Each question must have at least one correct answer");
            }
        }
    }


}