package com.mostafa.lms_api.mapper;

import com.mostafa.lms_api.dto.comment.CommentResponseDTO;
import com.mostafa.lms_api.dto.comment.CreateCommentDTO;
import com.mostafa.lms_api.dto.course.CourseResponseDTO;
import com.mostafa.lms_api.dto.course.CourseSummaryDTO;
import com.mostafa.lms_api.dto.course.CreateCourseDTO;
import com.mostafa.lms_api.dto.enrollment.EnrollmentResponseDTO;
import com.mostafa.lms_api.dto.file.CreateFileDTO;
import com.mostafa.lms_api.dto.file.FileResponseDTO;
import com.mostafa.lms_api.dto.notification.NotificationDTO;
import com.mostafa.lms_api.dto.post.CreatePostDTO;
import com.mostafa.lms_api.dto.post.PostResponseDTO;
import com.mostafa.lms_api.dto.progress.ProgressResponseDTO;
import com.mostafa.lms_api.dto.quiz.create.CreateQuizDTO;
import com.mostafa.lms_api.dto.quiz.get.*;
import com.mostafa.lms_api.dto.quiz.update.UpdateQuizDTO;
import com.mostafa.lms_api.dto.reply.CreateReplyDTO;
import com.mostafa.lms_api.dto.reply.ReplyResponseDTO;
import com.mostafa.lms_api.dto.section.CreateSectionDTO;
import com.mostafa.lms_api.dto.section.SectionResponseDTO;
import com.mostafa.lms_api.dto.section.SectionSummaryDTO;
import com.mostafa.lms_api.dto.transaction.request.CreateCourseTransaction;
import com.mostafa.lms_api.dto.transaction.request.CreateFileTransaction;
import com.mostafa.lms_api.dto.transaction.request.CreateSectionTransaction;
import com.mostafa.lms_api.dto.transaction.request.CreateVideoTransaction;
import com.mostafa.lms_api.dto.user.UserResponseDTO;
import com.mostafa.lms_api.dto.video.CreateVideoDTO;
import com.mostafa.lms_api.dto.video.VideoResponseDTO;
import com.mostafa.lms_api.enums.EnrollmentStatus;
import com.mostafa.lms_api.model.*;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;


@Component
public class EntityDtoMapper {

    //    ****************************** ((User)) ************************* //
    public UserResponseDTO toUserResponseDTO(User user) {
        return new UserResponseDTO(
                user.getId(),
                user.getUsername(),
                user.getEmail(),
                user.getFirstName(),
                user.getLastName(),
                user.getPhoneNumber(),
                user.getFatherPhoneNumber(),
                user.getProfileImageUrl(),
                user.getLevel(),
                user.getRole()
        );
    }

    //    ****************************** ((Course)) ************************* //
    public Course toCourseEntity(CreateCourseDTO dto) {
        return Course.builder()
                .title(dto.title())
                .description(dto.description())
                .shortDescription(dto.shortDescription())
                .courseImg(dto.courseImg())
                .level(dto.level())
                .build();
    }

    // NEW: Convert transaction DTO to Course entity
    public Course toCourseEntity(CreateCourseTransaction dto, User user) {
        return Course.builder()
                .title(dto.title())
                .description(dto.description())
                .shortDescription(dto.shortDescription())
                .courseImg(dto.courseImg())
                .level(dto.level())
                .user(user)
                .build();
    }

    public CourseResponseDTO toCourseResponseDTO(Course course) {
        return new CourseResponseDTO(
                course.getId(),
                course.getTitle(),
                course.getDescription(),
                course.getShortDescription(),
                course.getCourseImg(),
                course.getPrice(),
                course.getEstimatedDurationHours(),
                course.getIsPublished(),
                course.getStatus(),
                course.getLevel(),
                course.getUser().getId(),
                course.getUser().getProfileImageUrl(),
                course.getUser().getFirstName(),
                course.getUser().getLastName()
        );
    }

    //    ****************************** ((Section)) ************************* //
    public Section toSectionEntity(CreateSectionDTO dto) {
        return Section.builder()
                .title(dto.title())
                .description(dto.description())
                .price(dto.price())
                .sortOrder(dto.sortOrder())
                .build();
    }

    // NEW: Convert transaction DTO to Section entity
    public Section toSectionEntity(CreateSectionTransaction dto, Course course) {
        return Section.builder()
                .title(dto.title())
                .description(dto.description())
                .price(dto.price())
                .sortOrder(dto.sortOrder())
                .course(course)
                .build();
    }

    public SectionResponseDTO toSectionResponseDTO(Section section, String duration) {
        return new SectionResponseDTO(
                section.getId(),
                section.getTitle(),
                section.getDescription(),
                section.getIsPublished(),
                section.getPrice(),
                section.getSortOrder(),
                duration
        );
    }

    // NEW: Section response without duration calculation
    public SectionResponseDTO toSectionResponseDTO(Section section) {
        return new SectionResponseDTO(
                section.getId(),
                section.getTitle(),
                section.getDescription(),
                section.getIsPublished(),
                section.getPrice(),
                section.getSortOrder(),
                "0 minutes" // Default duration
        );
    }

    //    ****************************** ((File)) ************************* //
    public File toFileEntity(CreateFileDTO dto) {
        return File.builder()
                .title(dto.title())
                .fileUrl(dto.fileUrl())
                .build();
    }

    // NEW: Convert transaction DTO to File entity
    public File toFileEntity(CreateFileTransaction dto, Section section) {
        return File.builder()
                .title(dto.title())
                .fileUrl(dto.fileUrl())
                .isPreview(dto.isPreview() != null ? dto.isPreview() : false)
                .section(section)
                .build();
    }

    public FileResponseDTO toFileResponseDTO(File file) {
        return new FileResponseDTO(
                file.getId(),
                file.getTitle(),
                file.getFileUrl(),
                file.getIsPreview()
        );
    }

    // File response with access control
    public FileResponseDTO toFileResponseDTOWithAccess(File file, boolean hasAccess) {
        // If user has access, show everything. If not, only show preview files
        boolean canAccess = hasAccess || file.getIsPreview();

        return new FileResponseDTO(
                file.getId(),
                file.getTitle(),
                canAccess ? file.getFileUrl() : null, // Hide URL if no access
                canAccess // Set to true if user can access
        );
    }

    //    ****************************** ((Video)) ************************* //
    public Video toVideoEntity(CreateVideoDTO dto) {
        return Video.builder()
                .title(dto.title())
                .videoUrl(dto.videoUrl())
                .sortOrder(dto.sortOrder())
                .durationSeconds(dto.durationSeconds())
                .build();
    }

    // NEW: Convert transaction DTO to Video entity
    public Video toVideoEntity(CreateVideoTransaction dto, Section section) {
        return Video.builder()
                .title(dto.title())
                .videoUrl(dto.videoUrl())
                .sortOrder(dto.sortOrder())
                .durationSeconds(dto.durationSeconds())
                .isPreview(dto.isPreview() != null ? dto.isPreview() : false)
                .section(section)
                .build();
    }

    // Helper method to format duration
    private String formatDuration(Integer durationSeconds) {
        if (durationSeconds == null || durationSeconds == 0) {
            return "0 seconds";
        }

        long hours = durationSeconds / 3600;
        long minutes = (durationSeconds % 3600) / 60;
        long seconds = durationSeconds % 60;

        if (hours > 0) {
            return String.format("%d hours, %d minutes", hours, minutes);
        } else if (minutes > 0) {
            return String.format("%d minutes, %d seconds", minutes, seconds);
        } else {
            return String.format("%d seconds", seconds);
        }
    }

    public VideoResponseDTO toVideoResponseDTO(Video video) {
        String formattedDuration = formatDuration(video.getDurationSeconds());

        return new VideoResponseDTO(
                video.getId(),
                video.getTitle(),
                video.getVideoUrl(),
                video.getIsPreview(),
                video.getDurationSeconds(),
                formattedDuration,
                video.getSortOrder()
        );
    }

    // Video response with access control
    public VideoResponseDTO toVideoResponseDTOWithAccess(Video video, boolean hasAccess) {
        String formattedDuration = formatDuration(video.getDurationSeconds());

        // If user has access, show everything. If not, only show preview videos
        boolean canAccess = hasAccess || video.getIsPreview();

        return new VideoResponseDTO(
                video.getId(),
                video.getTitle(),
                canAccess ? video.getVideoUrl() : null, // Hide URL if no access
                canAccess, // Set to true if user can access
                canAccess ? video.getDurationSeconds() : null, // Hide duration if no access
                canAccess ? formattedDuration : "Preview only",
                video.getSortOrder()
        );
    }

    //    ****************************** ((Progress)) ************************* //
    public ProgressResponseDTO toProgressResponseDTO(Progress progress) {
        return new ProgressResponseDTO(
                progress.getId(),
                progress.getWatchDurationSeconds(),
                progress.getCompletionPercentage(),
                progress.getIsCompleted(),
                progress.getLastWatchedAt(),
                // User
                progress.getUser().getId(),
                progress.getUser().getUsername(),
                progress.getUser().getFirstName(),
                progress.getUser().getLastName(),
                progress.getUser().getEmail(),
                // Course
                progress.getCourse().getId(),
                progress.getCourse().getTitle(),
                progress.getCourse().getShortDescription(),
                progress.getCourse().getCourseImg(),
                progress.getCourse().getEstimatedDurationHours(),
                // Video
                progress.getVideo().getId(),
                progress.getVideo().getTitle(),
                progress.getVideo().getDurationSeconds(),
                progress.getVideo().getSortOrder(),
                progress.getVideo().getIsPreview()
        );
    }

    //    ****************************** ((Enrollments)) ************************* //
    public EnrollmentResponseDTO toEnrollmentResponseDTO(Enrollment enrollment) {
        if (enrollment == null) {
            return null;
        }

        // Determine if user is enrolled based on enrollment status
        boolean isEnrolled = enrollment.getStatus() == EnrollmentStatus.ACTIVE;

        return new EnrollmentResponseDTO(
                enrollment.getId(),
                enrollment.getAmountPaid(),
                enrollment.getStatus(),
                enrollment.getCreatedDate(),
                isEnrolled,
                // Course field
                toCourseSummaryDTO(enrollment.getSection().getCourse())
        );
    }

    public CourseSummaryDTO toCourseSummaryDTO(Course course) {
        if (course == null) {
            return null;
        }

        return new CourseSummaryDTO(
                course.getId(),
                course.getTitle(),
                course.getCourseImg(),
                course.getLevel(),
                toSectionSummaryDTOList(course.getSections())
        );
    }

    public List<SectionSummaryDTO> toSectionSummaryDTOList(List<Section> sections) {
        if (sections == null) {
            return null;
        }

        return sections.stream()
                .map(this::toSectionSummaryDTO)
                .collect(Collectors.toList());
    }

    public SectionSummaryDTO toSectionSummaryDTO(Section section) {
        if (section == null) {
            return null;
        }

        return new SectionSummaryDTO(
                section.getId(),
                section.getTitle(),
                section.getPrice(),
                section.getSortOrder()
        );
    }


    // **************************************************************************** //
    // ====================== TO ENTITY METHODS ======================
    public Quiz toQuizEntity(CreateQuizDTO dto, Course course, User user) {
        Quiz quiz = Quiz.builder()
                .title(dto.title())
                .description(dto.description())
                .startTime(dto.startTime())
                .endTime(dto.endTime())
                .maxAttempts(1) // Default value
                .course(course)
                .user(user)
                .questions(new ArrayList<>())
                .build();

        // Map questions
        List<Question> questions = dto.questions().stream()
                .map(questionDTO -> toQuestionEntity(questionDTO, quiz))
                .collect(Collectors.toList());

        quiz.setQuestions(questions);
        return quiz;
    }

    public Question toQuestionEntity(com.mostafa.lms_api.dto.quiz.create.CreateQuestionDTO dto, Quiz quiz) {
        Question question = Question.builder()
                .questionText(dto.questionText())
                .points(dto.points())
                .quiz(quiz)
                .options(new ArrayList<>())
                .build();

        // Map options
        List<QuestionOption> options = dto.options().stream()
                .map(optionDTO -> toQuestionOptionEntity(optionDTO, question))
                .collect(Collectors.toList());

        question.setOptions(options);
        return question;
    }

    public QuestionOption toQuestionOptionEntity(com.mostafa.lms_api.dto.quiz.create.CreateQuestionOptionDTO dto, Question question) {
        return QuestionOption.builder()
                .optionText(dto.optionText())
                .optionSelect(dto.optionSelect())
                .isCorrect(dto.isCorrect())
                .question(question)
                .build();
    }

    // ====================== TO DTO METHODS ======================

    public QuizSummaryResponseDTO toQuizSummaryResponseDTO(Quiz quiz) {
        return new QuizSummaryResponseDTO(
                quiz.getId(),
                quiz.getTitle(),
                quiz.getDescription(),
                quiz.getStartTime(),
                quiz.getEndTime(),
                quiz.getMaxAttempts(),
                quiz.getUser().getId(),
                quiz.getUser().getFirstName(),
                quiz.getUser().getLastName(),
                quiz.getUser().getProfileImageUrl(),
                quiz.getCourse().getTitle(),
                quiz.getCourse().getCourseImg(),
                quiz.getCourse().getLevel()
        );
    }

    public QuizResponseDTO toQuizResponseDTO(Quiz quiz, boolean hideCorrectAnswers) {
        List<QuestionResponseDTO> questions = quiz.getQuestions().stream()
                .map(question -> toQuestionResponseDTO(question, hideCorrectAnswers))
                .collect(Collectors.toList());

        return new QuizResponseDTO(
                quiz.getId(),
                quiz.getTitle(),
                quiz.getDescription(),
                quiz.getStartTime(),
                quiz.getEndTime(),
                quiz.getMaxAttempts(),
                quiz.getUser().getId(),
                quiz.getUser().getFirstName(),
                quiz.getUser().getLastName(),
                quiz.getUser().getProfileImageUrl(),
                quiz.getCourse().getId(),
                quiz.getCourse().getTitle(),
                quiz.getCourse().getCourseImg(),
                quiz.getCourse().getLevel(),
                questions
        );
    }

    public QuestionResponseDTO toQuestionResponseDTO(Question question, boolean hideCorrectAnswers) {
        List<QuestionOptionResponseDTO> options = question.getOptions().stream()
                .map(option -> toQuestionOptionResponseDTO(option, hideCorrectAnswers))
                .collect(Collectors.toList());

        return new QuestionResponseDTO(
                question.getId(),
                question.getQuestionText(),
                question.getPoints(),
                options
        );
    }

    public QuestionOptionResponseDTO toQuestionOptionResponseDTO(QuestionOption option, boolean hideCorrectAnswers) {
        return new QuestionOptionResponseDTO(
                option.getId(),
                option.getOptionText(),
                option.getOptionSelect(),
                hideCorrectAnswers ? null : option.getIsCorrect()
        );
    }

    public QuizAttemptResponseDTO mapToQuizAttemptResponseDTO(QuizAttempt attempt) {
        return new QuizAttemptResponseDTO(
                attempt.getId(),
                attempt.getAttemptNumber(),
                attempt.getStartedAt(),
                attempt.getCompletedAt(),
                attempt.getTotalScore(),
                attempt.getIsCompleted(),
                attempt.getQuiz().getId(),
                attempt.getQuiz().getTitle(),
                attempt.getQuiz().getDescription(),
                attempt.getQuiz().getCourse().getId(),
                attempt.getQuiz().getCourse().getTitle(),
                attempt.getQuiz().getCourse().getCourseImg(),
                attempt.getQuiz().getCourse().getLevel(),
                // Calculate total possible points
                attempt.getQuiz().getQuestions().stream()
                        .mapToDouble(Question::getPoints)
                        .sum(),
                // Map user answers with correct answer info
                attempt.getUserAnswers().stream()
                        .map(this::mapToUserAnswerResponseDTO)
                        .collect(Collectors.toList())
        );
    }

    public UserAnswerResponseDTO mapToUserAnswerResponseDTO(UserAnswer userAnswer) {
        return new UserAnswerResponseDTO(
                userAnswer.getId(),
                userAnswer.getQuestion().getId(),
                userAnswer.getQuestion().getQuestionText(),
                userAnswer.getSelectedOption().getId(),
                userAnswer.getSelectedOption().getOptionText(),
                userAnswer.getSelectedOption().getOptionSelect(),
                userAnswer.getIsCorrect(),
                userAnswer.getPointsEarned(),
                userAnswer.getAnsweredAt(),
                // Get correct answer
                userAnswer.getQuestion().getOptions().stream()
                        .filter(QuestionOption::getIsCorrect)
                        .findFirst()
                        .map(option -> new CorrectAnswerDTO(
                                option.getId(),
                                option.getOptionText(),
                                option.getOptionSelect()
                        ))
                        .orElse(null)
        );
    }


    // ====================== UPDATE ENTITY METHODS ======================
    public Quiz updateQuizFromDTO(Quiz existingQuiz, UpdateQuizDTO dto) {
        existingQuiz.setTitle(dto.title());
        existingQuiz.setDescription(dto.description());
        existingQuiz.setStartTime(dto.startTime());
        existingQuiz.setEndTime(dto.endTime());

        // Handle questions update
        updateQuestionsFromDTO(existingQuiz, dto.questions());

        return existingQuiz;
    }

    private void updateQuestionsFromDTO(Quiz quiz, List<com.mostafa.lms_api.dto.quiz.update.UpdateQuestionDTO> questionDTOs) {
        List<Question> existingQuestions = quiz.getQuestions();
        List<Question> updatedQuestions = new ArrayList<>();

        for (com.mostafa.lms_api.dto.quiz.update.UpdateQuestionDTO questionDTO : questionDTOs) {
            Question question;

            if (questionDTO.id() != null) {
                // Update existing question
                question = existingQuestions.stream()
                        .filter(q -> q.getId().equals(questionDTO.id()))
                        .findFirst()
                        .orElseThrow(() -> new RuntimeException("Question not found: " + questionDTO.id()));

                question.setQuestionText(questionDTO.questionText());
                question.setPoints(questionDTO.points());
                updateQuestionOptionsFromDTO(question, questionDTO.options());
            } else {
                // Create new question
                question = Question.builder()
                        .questionText(questionDTO.questionText())
                        .points(questionDTO.points())
                        .quiz(quiz)
                        .options(new ArrayList<>())
                        .build();

                List<QuestionOption> options = questionDTO.options().stream()
                        .map(optionDTO -> QuestionOption.builder()
                                .optionText(optionDTO.optionText())
                                .optionSelect(optionDTO.optionSelect())
                                .isCorrect(optionDTO.isCorrect())
                                .question(question)
                                .build())
                        .collect(Collectors.toList());

                question.setOptions(options);
            }

            updatedQuestions.add(question);
        }

        // Clear existing questions and set updated ones
        existingQuestions.clear();
        existingQuestions.addAll(updatedQuestions);
    }

    private void updateQuestionOptionsFromDTO(Question question, List<com.mostafa.lms_api.dto.quiz.update.UpdateQuestionOptionDTO> optionDTOs) {
        List<QuestionOption> existingOptions = question.getOptions();
        List<QuestionOption> updatedOptions = new ArrayList<>();

        for (com.mostafa.lms_api.dto.quiz.update.UpdateQuestionOptionDTO optionDTO : optionDTOs) {
            QuestionOption option;

            if (optionDTO.id() != null) {
                // Update existing option
                option = existingOptions.stream()
                        .filter(o -> o.getId().equals(optionDTO.id()))
                        .findFirst()
                        .orElseThrow(() -> new RuntimeException("Option not found: " + optionDTO.id()));

                option.setOptionText(optionDTO.optionText());
                option.setOptionSelect(optionDTO.optionSelect());
                option.setIsCorrect(optionDTO.isCorrect());
            } else {
                // Create new option
                option = QuestionOption.builder()
                        .optionText(optionDTO.optionText())
                        .optionSelect(optionDTO.optionSelect())
                        .isCorrect(optionDTO.isCorrect())
                        .question(question)
                        .build();
            }

            updatedOptions.add(option);
        }

        // Clear existing options and set updated ones
        existingOptions.clear();
        existingOptions.addAll(updatedOptions);
    }


    // **************************************************************************** //
    //    ****************************** ((Post)) ************************* //
    public Post toPostEntity(CreatePostDTO dto) {
        return Post.builder()
                .text(dto.text())
                .imageUrl(dto.imageUrl())
                .build();
    }

    public PostResponseDTO toPostResponseDTO(Post post, Long likesCount, Boolean isLikedByCurrentUser) {
        return new PostResponseDTO(
                post.getId(),
                post.getText(),
                post.getImageUrl(),
                post.getCreatedDate(),
                post.getLastModifiedDate(),
                likesCount,
                post.getUser().getId(),
                post.getUser().getFirstName(),
                post.getUser().getLastName(),
                post.getUser().getProfileImageUrl(),
                isLikedByCurrentUser
        );
    }

    //    ****************************** ((Comment)) ************************* //
    public Comment toCommentEntity(CreateCommentDTO dto) {
        return Comment.builder()
                .text(dto.text())
                .build();
    }

    public CommentResponseDTO toCommentResponseDTO(
            Comment comment,
            Long commentLikesCount,
            Boolean isLikedByCurrentUser) {
        return new CommentResponseDTO(
                comment.getId(),
                comment.getText(),
                comment.getCreatedDate(),
                comment.getLastModifiedDate(),
                commentLikesCount,
                comment.getUser().getId(),
                comment.getUser().getFirstName(),
                comment.getUser().getLastName(),
                comment.getUser().getProfileImageUrl(),
                isLikedByCurrentUser,
                comment.getPost().getId(),
                comment.getPost().getText()
        );
    }


    //    ****************************** ((Reply)) ************************* //
    public Reply toReplyEntity(CreateReplyDTO dto) {
        return Reply.builder()
                .text(dto.text())
                .build();
    }

    public ReplyResponseDTO toReplyResponseDTO(Reply reply, Long likesCount, Boolean isLikedByCurrentUser) {
        return new ReplyResponseDTO(
                reply.getId(),
                reply.getText(),
                reply.getCreatedDate(),
                reply.getLastModifiedDate(),
                likesCount,
                reply.getUser().getId(),
                reply.getUser().getFirstName(),
                reply.getUser().getLastName(),
                reply.getUser().getProfileImageUrl(),
                isLikedByCurrentUser,
                reply.getComment().getId()
        );
    }


    //    ****************************** ((Notifications)) ************************* //
    public NotificationDTO toNotificationDTO(Notification notification) {
        return new NotificationDTO(
                notification.getId(),
                notification.getTitle(),
                notification.getMessage(),
                notification.getIsRead(),
                notification.getType(),
                notification.getCreatedDate(),
                notification.getReferenceId(),
                notification.getTriggeredByUser().getId(),
                notification.getTriggeredByUser().getFirstName(),
                notification.getTriggeredByUser().getLastName(),
                notification.getTriggeredByUser().getEmail(),
                notification.getTriggeredByUser().getProfileImageUrl()
        );
    }


}