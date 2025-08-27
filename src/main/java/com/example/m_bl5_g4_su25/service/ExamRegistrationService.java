package com.example.m_bl5_g4_su25.service;

import com.example.m_bl5_g4_su25.dto.request.ExamRegistrationCreateRequest;
import com.example.m_bl5_g4_su25.dto.request.UpdateExamRegistrationStatusRequest;
import com.example.m_bl5_g4_su25.dto.response.ApiResponse;
import com.example.m_bl5_g4_su25.dto.response.ExamRegistrationManagementResponse;
import com.example.m_bl5_g4_su25.entity.Course;
import com.example.m_bl5_g4_su25.entity.ExamRegistration;
import com.example.m_bl5_g4_su25.entity.ExamSchedule;
import com.example.m_bl5_g4_su25.entity.User;
import com.example.m_bl5_g4_su25.enums.RegistrationStatus;
import com.example.m_bl5_g4_su25.exception.AppException;
import com.example.m_bl5_g4_su25.exception.ErrorCode;
import com.example.m_bl5_g4_su25.repository.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.time.Instant;
import java.time.ZoneOffset;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class ExamRegistrationService {

    private final ExamRegistrationRepository examRegistrationRepository;
    private final ExamScheduleRepository examScheduleRepository;
    private final UserRepository userRepository;
    private final CourseRepository courseRepository;
    private final EnrollmentRepository enrollmentRepository;

    public ApiResponse<String> registerForCourse(Long courseId,
                                                 ExamRegistrationCreateRequest request) {
        Course course = courseRepository.findById(courseId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND,
                        "Course not found with id: " + courseId));
        List<User> learners = enrollmentRepository.findLearnersByCourse(course);

        ExamSchedule examSchedule = examScheduleRepository.findById(request.getExamScheduleId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND,
                        "Exam Schedule not found with id: " + request.getExamScheduleId()));

        if (learners == null || learners.isEmpty()) {
            throw new AppException(ErrorCode.COURSE_NO_ENROLLED_LEARNERS);
        }

        for (User learner : learners) {
            boolean alreadyRegistered = examRegistrationRepository.existsByLearnerAndExamSchedule(learner, examSchedule);
            if (alreadyRegistered) {
                continue;
            }
            ExamRegistration examRegistration = new ExamRegistration();
            examRegistration.setLearner(learner);
            examRegistration.setExamSchedule(examSchedule);
            examRegistration.setRegistrationDate(Instant.now());
            examRegistration.setStatus(RegistrationStatus.PENDING.name());
            examRegistrationRepository.save(examRegistration);
        }

        return ApiResponse.success("Registered successfully", "OK");
    }

    public ApiResponse<List<ExamRegistrationManagementResponse>> getAllRegistrations() {
        List<ExamRegistration> registrations = examRegistrationRepository.findAll();
        List<ExamRegistrationManagementResponse> responses = registrations.stream()
                .map(this::mapToManagementResponse)
                .collect(Collectors.toList());
        return ApiResponse.success("OK", responses);
    }

    public ApiResponse<String> updateStatus(Long registrationId, UpdateExamRegistrationStatusRequest request) {
        ExamRegistration registration = examRegistrationRepository.findById(registrationId)
                .orElseThrow(() -> new AppException(ErrorCode.EXAM_REGISTRATION_NOT_FOUND));

        if (request == null || request.getStatus() == null) {
            throw new AppException(ErrorCode.INVALID_STATUS);
        }

        String newStatus = request.getStatus().trim().toUpperCase();
        if (!"CONFIRMED".equals(newStatus) && !"CANCELLED".equals(newStatus)) {
            throw new AppException(ErrorCode.INVALID_STATUS);
        }

        registration.setStatus(newStatus);
        examRegistrationRepository.save(registration);

        return ApiResponse.success("Status updated successfully", "OK");
    }

    public ApiResponse<String> updateCourseScheduleStatus(Long courseId, Long examScheduleId, String status) {
        Course course = courseRepository.findById(courseId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND,
                        "Course not found with id: " + courseId));

        String normalized = status == null ? null : status.trim().toUpperCase();
        if (!"CONFIRMED".equals(normalized) && !"CANCELLED".equals(normalized)) {
            throw new AppException(ErrorCode.INVALID_STATUS);
        }

        List<User> learners = enrollmentRepository.findLearnersByCourse(course);
        if (learners.isEmpty()) {
            return ApiResponse.success("OK", "OK");
        }

        List<Long> learnerIds = learners.stream().map(User::getId).collect(Collectors.toList());
        List<ExamRegistration> regs = examRegistrationRepository
                .findByLearner_IdInAndExamSchedule_Id(learnerIds, examScheduleId);
        for (ExamRegistration reg : regs) {
            reg.setStatus(normalized);
        }
        examRegistrationRepository.saveAll(regs);
        return ApiResponse.success("OK", "OK");
    }

    public ApiResponse<String> deleteRegistration(Long registrationId) {
        ExamRegistration registration = examRegistrationRepository.findById(registrationId)
                .orElseThrow(() -> new AppException(ErrorCode.EXAM_REGISTRATION_NOT_FOUND));

        examRegistrationRepository.delete(registration);
        return ApiResponse.success("Registration deleted successfully", "OK");
    }

    public ApiResponse<Map<Long, String>> getStatusesForSchedules(List<Long> examScheduleIds) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String username = authentication.getName();
        User learner = userRepository.findByUsername(username)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));

        if (examScheduleIds == null || examScheduleIds.isEmpty()) {
            return ApiResponse.success("OK", Map.of());
        }

        List<ExamRegistration> registrations = examRegistrationRepository
                .findByLearner_IdAndExamSchedule_IdIn(learner.getId(), examScheduleIds);

        Map<Long, String> statusByScheduleId = registrations.stream()
                .collect(Collectors.toMap(
                        r -> r.getExamSchedule().getId(),
                        ExamRegistration::getStatus,
                        (a, b) -> a
                ));

        return ApiResponse.success("OK", statusByScheduleId);
    }

    public ApiResponse<Map<Long, String>> getCourseStatusesForSchedules(Long courseId, List<Long> examScheduleIds) {
        Course course = courseRepository.findById(courseId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND,
                        "Course not found with id: " + courseId));

        if (examScheduleIds == null || examScheduleIds.isEmpty()) {
            return ApiResponse.success("OK", Map.of());
        }

        List<User> learners = enrollmentRepository.findLearnersByCourse(course);
        List<Long> learnerIds = learners.stream().map(User::getId).collect(Collectors.toList());
        if (learnerIds.isEmpty()) {
            return ApiResponse.success("OK", Map.of());
        }

        List<ExamRegistration> registrations = examRegistrationRepository
                .findByLearner_IdInAndExamSchedule_IdIn(learnerIds, examScheduleIds);

        Map<Long, String> statusByScheduleId = registrations.stream()
                .collect(Collectors.toMap(
                        r -> r.getExamSchedule().getId(),
                        ExamRegistration::getStatus,
                        (a, b) -> a
                ));

        return ApiResponse.success("OK", statusByScheduleId);
    }

    private ExamRegistrationManagementResponse mapToManagementResponse(ExamRegistration registration) {
        return ExamRegistrationManagementResponse.builder()
                .id(registration.getId())
                .learnerName(registration.getLearner().getFirstName() + " " + registration.getLearner().getLastName())
                .learnerEmail(registration.getLearner().getEmail())
                .examName(registration.getExamSchedule().getExam().getExamName())
                .examScheduleName("Schedule " + registration.getExamSchedule().getId())
                .examDate(registration.getExamSchedule().getExamDate()
                        .atStartOfDay().toInstant(ZoneOffset.UTC))
                .location(registration.getExamSchedule().getLocation())
                .registrationDate(registration.getRegistrationDate())
                .status(registration.getStatus())
                .build();
    }
}