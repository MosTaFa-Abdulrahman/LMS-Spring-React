package com.mostafa.lms_api.service;


import com.mostafa.lms_api.dto.choice.UpdateChoiceDTO;
import com.mostafa.lms_api.dto.question.CreateQuestionDTO;
import com.mostafa.lms_api.dto.question.UpdateQuestionDTO;
import com.mostafa.lms_api.dto.quiz.CreateQuizDTO;
import com.mostafa.lms_api.dto.quiz.QuizResponseDTO;
import com.mostafa.lms_api.dto.quiz.UpdateQuizDTO;
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

import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.stream.Collectors;


@Service
@RequiredArgsConstructor
public class QuizService {
    private final QuizRepo quizRepo;
    private final QuestionRepo questionRepo;
    private final ChoiceRepo choiceRepo;
    private final CurrentUser currentUser;
    private final UserRepo userRepo;
    private final CourseRepo courseRepo;
    private final EntityDtoMapper mapper;


    //  Helper Update Quiz Questions
    private void updateQuizQuestions(Quiz quiz, Map<UUID, UpdateQuestionDTO> questionUpdates) {
        for (Map.Entry<UUID, UpdateQuestionDTO> entry : questionUpdates.entrySet()) {
            UUID questionId = entry.getKey();
            UpdateQuestionDTO updateDTO = entry.getValue();

            Question question = questionRepo.findById(questionId)
                    .orElseThrow(() -> CustomResponseException.ResourceNotFound("Question not found"));

            // Verify question belongs to this quiz
            if (!question.getQuiz().getId().equals(quiz.getId())) {
                throw CustomResponseException.BadRequest("Question does not belong to this quiz");
            }

            // Update question fields
            if (updateDTO.text() != null) question.setText(updateDTO.text());
            if (updateDTO.questionImage() != null) question.setQuestionImage(updateDTO.questionImage());
            if (updateDTO.points() != null) question.setPoints(updateDTO.points());

            // Update choices if provided
            if (updateDTO.choices() != null && !updateDTO.choices().isEmpty()) {
                updateQuestionChoices(question, updateDTO.choices());
            }

            questionRepo.save(question);
        }

        // Recalculate total score
        Double totalScore = quiz.getQuestions().stream()
                .mapToDouble(Question::getPoints).sum();
        quiz.setTotalScore(totalScore);
    }

    // Helper method for updating choices
    private void updateQuestionChoices(Question question, Map<UUID, UpdateChoiceDTO> choiceUpdates) {
        for (Map.Entry<UUID, UpdateChoiceDTO> entry : choiceUpdates.entrySet()) {
            UUID choiceId = entry.getKey();
            UpdateChoiceDTO updateDTO = entry.getValue();

            Choice choice = choiceRepo.findById(choiceId)
                    .orElseThrow(() -> CustomResponseException.ResourceNotFound("Choice not found"));

            // Verify choice belongs to this question
            if (!choice.getQuestion().getId().equals(question.getId())) {
                throw CustomResponseException.BadRequest("Choice does not belong to this question");
            }

            // Update choice fields
            if (updateDTO.choiceText() != null) choice.setChoiceText(updateDTO.choiceText());
            if (updateDTO.choiceLabel() != null) choice.setChoiceLabel(updateDTO.choiceLabel());
            if (updateDTO.isCorrect() != null) choice.setIsCorrect(updateDTO.isCorrect());

            choiceRepo.save(choice);
        }

        // Validate that exactly one choice is marked as correct
        long correctChoicesCount = question.getChoices().stream()
                .filter(Choice::getIsCorrect)
                .count();

        if (correctChoicesCount != 1) {
            throw CustomResponseException.BadRequest("Question must have exactly one correct answer");
        }
    }


    // Create
    @Transactional
    public QuizResponseDTO createQuiz(CreateQuizDTO dto) {
        User user = currentUser.getCurrentUser();
        Course course = courseRepo.findById(dto.courseId())
                .orElseThrow(() -> CustomResponseException.ResourceNotFound("Course not found"));

        if (dto.endTime().isBefore(dto.startTime())) {
            throw CustomResponseException.BadRequest("End time must be after start time");
        }

        // Validate that all questions have exactly one correct answer
        for (CreateQuestionDTO questionDTO : dto.questions()) {
            if (!questionDTO.hasExactlyOneCorrectAnswer()) {
                throw CustomResponseException.BadRequest("Each question must have exactly one correct answer");
            }
        }

        // Create quiz
        Quiz quiz = mapper.toQuizEntity(dto, user, course);
        Quiz savedQuiz = quizRepo.save(quiz);

        // Create questions with choices
        List<Question> questions = dto.questions().stream()
                .map(q -> mapper.toQuestionEntity(q, savedQuiz))
                .collect(Collectors.toList());

        questionRepo.saveAll(questions);

        // Calculate total score
        Double totalScore = questions.stream().mapToDouble(Question::getPoints).sum();
        savedQuiz.setTotalScore(totalScore);
        savedQuiz.setQuestions(questions);

        return mapper.toQuizResponseDTO(quizRepo.save(savedQuiz));
    }

    // Update
    @Transactional
    public QuizResponseDTO updateQuiz(UUID quizId, UpdateQuizDTO dto) {
        Quiz quiz = quizRepo.findById(quizId)
                .orElseThrow(() -> CustomResponseException.ResourceNotFound("Quiz not found"));

        if (!quiz.getUser().getId().equals(currentUser.getCurrentUser().getId())) {
            throw CustomResponseException.BadRequest("Not authorized");
        }
        if (quiz.hasStarted()) {
            throw CustomResponseException.BadRequest("Cannot update started quiz");
        }

        // Update quiz metadata
        if (dto.title() != null) quiz.setTitle(dto.title());
        if (dto.description() != null) quiz.setDescription(dto.description());
        if (dto.startTime() != null) quiz.setStartTime(dto.startTime());
        if (dto.endTime() != null) quiz.setEndTime(dto.endTime());

        // Validate time if both are provided
        if (dto.startTime() != null && dto.endTime() != null) {
            if (dto.endTime().isBefore(dto.startTime())) {
                throw CustomResponseException.BadRequest("End time must be after start time");
            }
        }

        // Update questions if provided
        if (dto.questions() != null && !dto.questions().isEmpty()) {
            updateQuizQuestions(quiz, dto.questions());
        }

        return mapper.toQuizResponseDTO(quizRepo.save(quiz));
    }

    // Delete BY ((quizId))
    @Transactional
    public String deleteQuiz(UUID quizId) {
        Quiz quiz = quizRepo.findById(quizId)
                .orElseThrow(() -> CustomResponseException.ResourceNotFound("Quiz not found"));

        if (!quiz.getUser().getId().equals(currentUser.getCurrentUser().getId())) {
            throw CustomResponseException.BadRequest("Not authorized");
        }

        if (quiz.hasStarted()) {
            throw CustomResponseException.BadRequest("Cannot delete started quiz");
        }

        quizRepo.delete(quiz);
        return "Quiz Deleted Success";
    }

    //    Get All
    public Page<QuizResponseDTO> getAllQuizzes(int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<Quiz> quizzesPage = quizRepo.findAll(pageable);

        // Convert Page<Quiz> to Page<QuizResponseDTO>
        return quizzesPage.map(mapper::toQuizResponseDTOWithoutQuestions);
    }

    // Get Single BY ((quizId))
    @Transactional(readOnly = true)
    public QuizResponseDTO getQuizById(UUID quizId) {
        Quiz quiz = quizRepo.findById(quizId)
                .orElseThrow(() -> CustomResponseException.ResourceNotFound("Quiz not found"));

        return mapper.toQuizResponseDTO(quiz);
    }

    // Get All for ((Specific-User))
    @Transactional(readOnly = true)
    public List<QuizResponseDTO> getAllQuizzesForUser(UUID userId) {
        User user = userRepo.findById(userId).orElseThrow(() ->
                CustomResponseException.ResourceNotFound("User not found with this ID: " + userId));

        List<Quiz> quizzes = quizRepo.findByUserId(user.getId());

        return mapper.toQuizResponseDTOListWithoutQuestions(quizzes);
    }

    // Get All (((Completed))) for ((Specific-User))
    @Transactional(readOnly = true)
    public List<QuizResponseDTO> getTakenQuizzesByUser(UUID userId) {
        User user = userRepo.findById(userId).orElseThrow(() ->
                CustomResponseException.ResourceNotFound("User not found with this ID: " + userId));

        List<Quiz> takenQuizzes = quizRepo.findTakenQuizzesByUserId(user.getId());

        return mapper.toQuizResponseDTOListWithoutQuestions(takenQuizzes);
    }


    // ***************************** ((Specifications)) *********************** //
    // Submit Multiple Answers
    @Transactional
    public QuizResponseDTO submitAnswers(UUID quizId, Map<UUID, String> answers) {
        Quiz quiz = quizRepo.findById(quizId)
                .orElseThrow(() -> CustomResponseException.ResourceNotFound("Quiz not found with this ID: " + quizId));

        if (!quiz.getUser().getId().equals(currentUser.getCurrentUser().getId())) {
            throw CustomResponseException.BadRequest("Not authorized");
        }
        if (!quiz.isActive()) {
            throw CustomResponseException.BadRequest("Quiz not active");
        }

        if (quiz.getUserScore() > 0) {
            throw CustomResponseException.BadRequest("Quiz already completed");
        }

        // Submit all answers
        for (Map.Entry<UUID, String> entry : answers.entrySet()) {
            UUID questionId = entry.getKey();
            String answer = entry.getValue();

            Question question = questionRepo.findById(questionId)
                    .orElseThrow(() -> CustomResponseException.ResourceNotFound("Question not found: " + questionId));

            // Verify question belongs to this quiz
            if (!question.getQuiz().getId().equals(quiz.getId())) {
                throw CustomResponseException.BadRequest("Question does not belong to this quiz");
            }

            question.setUserAnswer(answer);
            questionRepo.save(question);
        }

        // Auto-calculate and save score
        return calculateAndSaveScore(quiz);
    }

    // Helper Calculate and Save Score
    @Transactional
    private QuizResponseDTO calculateAndSaveScore(Quiz quiz) {
        if (!quiz.getUser().getId().equals(currentUser.getCurrentUser().getId())) {
            throw CustomResponseException.BadRequest("Not authorized");
        }

        if (quiz.getUserScore() > 0) {
            throw CustomResponseException.BadRequest("Quiz already completed");
        }

        // Calculate user score using the new isUserAnswerCorrect method
        Double userScore = quiz.getQuestions().stream()
                .filter(Question::isUserAnswerCorrect)
                .mapToDouble(Question::getPoints)
                .sum();

        quiz.setUserScore(userScore);

        // Update total score (in case questions were modified)
        Double totalScore = quiz.getQuestions().stream()
                .mapToDouble(Question::getPoints).sum();
        quiz.setTotalScore(totalScore);

        return mapper.toQuizResponseDTO(quizRepo.save(quiz));
    }


}
