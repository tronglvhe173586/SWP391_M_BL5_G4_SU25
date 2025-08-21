package com.example.m_bl5_g4_su25.service;

import com.example.m_bl5_g4_su25.dto.request.ExamRegistrationCreateRequest;
import com.example.m_bl5_g4_su25.dto.request.UpdateExamRegistrationStatusRequest;
import com.example.m_bl5_g4_su25.dto.response.ApiResponse;
import com.example.m_bl5_g4_su25.dto.response.ExamRegistrationManagementResponse;
import com.example.m_bl5_g4_su25.entity.ExamRegistration;
import com.example.m_bl5_g4_su25.entity.ExamSchedule;
import com.example.m_bl5_g4_su25.entity.User;
import com.example.m_bl5_g4_su25.exception.AppException;
import com.example.m_bl5_g4_su25.exception.ErrorCode;
import com.example.m_bl5_g4_su25.repository.ExamRegistrationRepository;
import com.example.m_bl5_g4_su25.repository.ExamScheduleRepository;
import com.example.m_bl5_g4_su25.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.time.Instant;
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

    public ApiResponse<String> register(ExamRegistrationCreateRequest request) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String username = authentication.getName();
        User learner = userRepository.findByUsername(username)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));

        ExamSchedule schedule = examScheduleRepository.findById(request.getExamScheduleId())
                .orElseThrow(() -> new AppException(ErrorCode.EXAM_SCHEDULE_NOT_FOUND));

        examRegistrationRepository.findByExamSchedule_IdAndLearner_Id(schedule.getId(), learner.getId())
                .ifPresent(er -> {
                    throw new AppException(ErrorCode.EXAM_REGISTRATION_ALREADY_EXISTS);
                });

        if (schedule.getMaxParticipants() != null) {
            long current = examRegistrationRepository.countByExamSchedule_Id(schedule.getId());
            if (current >= schedule.getMaxParticipants()) {
                throw new AppException(ErrorCode.EXAM_SCHEDULE_FULL);
            }
        }

        ExamRegistration registration = new ExamRegistration();
        registration.setLearner(learner);
        registration.setExamSchedule(schedule);
        registration.setRegistrationDate(Instant.now());
        registration.setStatus("PENDING");
        examRegistrationRepository.save(registration);

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

        String newStatus = request.getStatus() == null ? "" : request.getStatus().trim().toUpperCase();
        if (!"ACCEPT".equals(newStatus) && !"REJECT".equals(newStatus)) {
            throw new AppException(ErrorCode.INVALID_STATUS);
        }

        registration.setStatus(newStatus);
        examRegistrationRepository.save(registration);

        return ApiResponse.success("Status updated successfully", "OK");
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

    private ExamRegistrationManagementResponse mapToManagementResponse(ExamRegistration registration) {
        return ExamRegistrationManagementResponse.builder()
                .id(registration.getId())
                .learnerName(registration.getLearner().getFirstName() + " " + registration.getLearner().getLastName())
                .learnerEmail(registration.getLearner().getEmail())
                .examName(registration.getExamSchedule().getExam().getExamName())
                .examScheduleName("Schedule " + registration.getExamSchedule().getId())
                .examDate(registration.getExamSchedule().getExamDate().atStartOfDay().toInstant(java.time.ZoneOffset.UTC))
                .location(registration.getExamSchedule().getLocation())
                .registrationDate(registration.getRegistrationDate())
                .status(registration.getStatus())
                .build();
    }
}


