package com.example.m_bl5_g4_su25.service;

import com.example.m_bl5_g4_su25.dto.request.ExamRegistrationCreateRequest;
import com.example.m_bl5_g4_su25.dto.response.ApiResponse;
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
}


