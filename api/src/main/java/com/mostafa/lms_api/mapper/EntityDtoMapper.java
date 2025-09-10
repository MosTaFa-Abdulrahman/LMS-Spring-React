package com.mostafa.lms_api.mapper;

import com.mostafa.lms_api.dto.choice.ChoiceResponseDTO;
import com.mostafa.lms_api.dto.choice.CreateChoiceDTO;
import com.mostafa.lms_api.dto.course.CourseResponseDTO;
import com.mostafa.lms_api.dto.course.CourseSummaryDTO;
import com.mostafa.lms_api.dto.course.CreateCourseDTO;
import com.mostafa.lms_api.dto.enrollment.EnrollmentResponseDTO;
import com.mostafa.lms_api.dto.file.CreateFileDTO;
import com.mostafa.lms_api.dto.file.FileResponseDTO;
import com.mostafa.lms_api.dto.progress.ProgressResponseDTO;
import com.mostafa.lms_api.dto.question.CreateQuestionDTO;
import com.mostafa.lms_api.dto.question.QuestionResponseDTO;
import com.mostafa.lms_api.dto.quiz.CreateQuizDTO;
import com.mostafa.lms_api.dto.quiz.QuizResponseDTO;
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


    //    ****************************** ((Quiz)) ************************* //
    public Choice toChoiceEntity(CreateChoiceDTO dto, Question question) {
        if (dto == null) {
            return null;
        }

        return Choice.builder()
                .choiceText(dto.choiceText())
                .choiceLabel(dto.choiceLabel().toUpperCase())
                .isCorrect(dto.isCorrect() != null ? dto.isCorrect() : false)
                .question(question)
                .build();
    }


    public ChoiceResponseDTO toChoiceResponseDTO(Choice choice) {
        if (choice == null) {
            return null;
        }

        return new ChoiceResponseDTO(
                choice.getId(),
                choice.getChoiceText(),
                choice.getChoiceLabel(),
                choice.getIsCorrect()
        );
    }


    public Question toQuestionEntity(CreateQuestionDTO dto, Quiz quiz) {
        if (dto == null) {
            return null;
        }

        Question question = Question.builder()
                .text(dto.text())
                .questionImage(dto.questionImage())
                .points(dto.points())
                .quiz(quiz)
                .userAnswer(null) // Initialize as null
                .build();

        // Create choices if provided
        if (dto.choices() != null && !dto.choices().isEmpty()) {
            List<Choice> choices = dto.choices().stream()
                    .map(choiceDTO -> toChoiceEntity(choiceDTO, question))
                    .collect(Collectors.toList());
            question.setChoices(choices);
        }

        return question;
    }


    public QuestionResponseDTO toQuestionResponseDTO(Question question) {
        if (question == null) {
            return null;
        }

        // Convert choices to response DTOs
        List<ChoiceResponseDTO> choiceDTOs = null;
        if (question.getChoices() != null && !question.getChoices().isEmpty()) {
            choiceDTOs = question.getChoices().stream()
                    .map(this::toChoiceResponseDTO)
                    .sorted((a, b) -> a.choiceLabel().compareTo(b.choiceLabel())) // Sort by label
                    .collect(Collectors.toList());
        }

        return new QuestionResponseDTO(
                question.getId(),
                question.getText(),
                question.getQuestionImage(),
                question.getUserAnswer(),
                question.getCorrectAnswerLabel(),
                question.getPoints(),
                choiceDTOs,
                question.isUserAnswerCorrect() // This returns boolean, but DTO accepts Boolean
        );
    }


    public QuestionResponseDTO toQuestionResponseDTOWithoutCorrectAnswer(Question question) {
        if (question == null) {
            return null;
        }

        // Convert choices to response DTOs but hide correct answer info
        List<ChoiceResponseDTO> choiceDTOs = null;
        if (question.getChoices() != null && !question.getChoices().isEmpty()) {
            choiceDTOs = question.getChoices().stream()
                    .map(choice -> new ChoiceResponseDTO(
                            choice.getId(),
                            choice.getChoiceText(),
                            choice.getChoiceLabel(),
                            null // Hide correct answer
                    ))
                    .sorted((a, b) -> a.choiceLabel().compareTo(b.choiceLabel()))
                    .collect(Collectors.toList());
        }

        return new QuestionResponseDTO(
                question.getId(),
                question.getText(),
                question.getQuestionImage(),
                question.getUserAnswer(),
                null, // Hide correct answer
                question.getPoints(),
                choiceDTOs,
                null // Hide if answered correctly
        );
    }

    public Quiz toQuizEntity(CreateQuizDTO dto, User user, Course course) {
        if (dto == null) {
            return null;
        }

        return Quiz.builder()
                .title(dto.title())
                .description(dto.description())
                .startTime(dto.startTime())
                .endTime(dto.endTime())
                .user(user)
                .course(course)
                .userScore(0.0) // Initialize user score
                .totalScore(0.0) // Will be calculated from questions
                .build();
    }


    public QuizResponseDTO toQuizResponseDTO(Quiz quiz) {
        if (quiz == null) {
            return null;
        }

        // Convert questions to response DTOs
        List<QuestionResponseDTO> questionDTOs = null;
        if (quiz.getQuestions() != null && !quiz.getQuestions().isEmpty()) {
            // Show correct answers if quiz is completed or ended
            if (quiz.isCompletedByUser() || quiz.hasEnded()) {
                questionDTOs = quiz.getQuestions().stream()
                        .map(this::toQuestionResponseDTO)
                        .collect(Collectors.toList());
            } else {
                // Hide correct answers if quiz is still active
                questionDTOs = quiz.getQuestions().stream()
                        .map(this::toQuestionResponseDTOWithoutCorrectAnswer)
                        .collect(Collectors.toList());
            }
        }

        return new QuizResponseDTO(
                quiz.getId(),
                quiz.getTitle(),
                quiz.getDescription(),
                quiz.getStartTime(),
                quiz.getEndTime(),
                quiz.getTotalScore(),
                quiz.getUserScore(),
                // User details
                quiz.getUser().getId(),
                quiz.getUser().getFirstName(),
                quiz.getUser().getLastName(),
                // Course details
                quiz.getCourse() != null ? quiz.getCourse().getId() : null,
                quiz.getCourse() != null ? quiz.getCourse().getCourseImg() : null,
                quiz.getCourse() != null ? quiz.getCourse().getLevel() : null,
                // Questions with choices
                questionDTOs,
                // Completion status
                quiz.isCompletedByUser()
        );
    }


    public QuizResponseDTO toQuizResponseDTOWithoutQuestions(Quiz quiz) {
        if (quiz == null) {
            return null;
        }

        return new QuizResponseDTO(
                quiz.getId(),
                quiz.getTitle(),
                quiz.getDescription(),
                quiz.getStartTime(),
                quiz.getEndTime(),
                quiz.getTotalScore(),
                quiz.getUserScore(),
                // User details
                quiz.getUser().getId(),
                quiz.getUser().getFirstName(),
                quiz.getUser().getLastName(),
                // Course details
                quiz.getCourse() != null ? quiz.getCourse().getId() : null,
                quiz.getCourse() != null ? quiz.getCourse().getCourseImg() : null,
                quiz.getCourse() != null ? quiz.getCourse().getLevel() : null,
                // No questions included
                null,
                // Completion status
                quiz.isCompletedByUser()
        );
    }


    public List<QuizResponseDTO> toQuizResponseDTOListWithoutQuestions(List<Quiz> quizzes) {
        if (quizzes == null || quizzes.isEmpty()) {
            return null;
        }

        return quizzes.stream()
                .map(this::toQuizResponseDTOWithoutQuestions)
                .collect(Collectors.toList());
    }


}