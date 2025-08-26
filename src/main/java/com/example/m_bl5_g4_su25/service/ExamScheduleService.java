package com.example.m_bl5_g4_su25.service;

import com.example.m_bl5_g4_su25.dto.request.ExamScheduleCreateRequest;
import com.example.m_bl5_g4_su25.dto.request.ExamScheduleUpdateRequest;
import com.example.m_bl5_g4_su25.dto.response.ExamScheduleDetailResponse;
import com.example.m_bl5_g4_su25.dto.response.ExamScheduleResponse;
import com.example.m_bl5_g4_su25.dto.response.LearnerExamScheduleResponse;
import com.example.m_bl5_g4_su25.entity.DrivingClass;
import com.example.m_bl5_g4_su25.entity.Exam;
import com.example.m_bl5_g4_su25.entity.ExamSchedule;
import com.example.m_bl5_g4_su25.entity.Enrollment;
import com.example.m_bl5_g4_su25.entity.User;
import com.example.m_bl5_g4_su25.entity.ExamRegistration;
import com.example.m_bl5_g4_su25.entity.ExamResult;
import com.example.m_bl5_g4_su25.exception.AppException;
import com.example.m_bl5_g4_su25.exception.ErrorCode;
import com.example.m_bl5_g4_su25.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;
import java.util.Optional;

@Service
public class ExamScheduleService implements IExamScheduleService {

        @Autowired
        private ExamScheduleRepository examScheduleRepository;

        @Autowired
        private ExamRepository examRepository;

        @Autowired
        private ClassRepository classRepository;

        @Autowired
        private UserRepository userRepository;

        @Autowired
        private EnrollmentRepository enrollmentRepository;

        @Autowired
        private ExamRegistrationRepository examRegistrationRepository;

        @Autowired
        private ExamResultRepository examResultRepository;

        @Override
        public List<ExamScheduleResponse> getAllExamSchedules() {
                List<ExamSchedule> examSchedules = examScheduleRepository.findAll();
                return examSchedules.stream()
                                .map(this::convertToResponse)
                                .collect(Collectors.toList());
        }

        @Override
        public ExamScheduleResponse createExamSchedule(ExamScheduleCreateRequest request) {
                Exam exam = examRepository.findById(request.getExamId())
                                .orElseThrow(() -> new RuntimeException(
                                                "Exam not found with id: " + request.getExamId()));

                ExamSchedule examSchedule = new ExamSchedule();
                examSchedule.setExam(exam);
                examSchedule.setExamDate(request.getExamDate());
                examSchedule.setStartTime(request.getStartTime());
                examSchedule.setLocation(request.getLocation());
                examSchedule.setMaxParticipants(request.getMaxParticipants());

                if (request.getClassId() != null) {
                        DrivingClass classField = classRepository.findById(request.getClassId())
                                        .orElseThrow(() -> new RuntimeException(
                                                        "Class not found with id: " + request.getClassId()));
                        examSchedule.setClassField(classField);
                }

                if (request.getInstructorId() != null) {
                        User instructor = userRepository.findById(request.getInstructorId())
                                        .orElseThrow(() -> new RuntimeException(
                                                        "Instructor not found with id: " + request.getInstructorId()));
                        examSchedule.setInstructor(instructor);
                }

                ExamSchedule savedExamSchedule = examScheduleRepository.save(examSchedule);
                return convertToResponse(savedExamSchedule);
        }

        @Override
        public ExamScheduleResponse getExamScheduleById(Long id) {
                ExamSchedule examSchedule = examScheduleRepository.findById(id)
                                .orElseThrow(() -> new AppException(ErrorCode.EXAM_SCHEDULE_NOT_FOUND));
                return convertToResponse(examSchedule);
        }

        @Override
        public ExamScheduleResponse updateExamSchedule(Long id, ExamScheduleUpdateRequest request) {
                ExamSchedule examSchedule = examScheduleRepository.findById(id)
                                .orElseThrow(() -> new AppException(ErrorCode.EXAM_SCHEDULE_NOT_FOUND));

                examSchedule.setExamDate(request.getExamDate());
                examSchedule.setStartTime(request.getStartTime());
                examSchedule.setLocation(request.getLocation());
                examSchedule.setMaxParticipants(request.getMaxParticipants());

                ExamSchedule saved = examScheduleRepository.save(examSchedule);
                return convertToResponse(saved);
        }

        @Override
        public ExamScheduleDetailResponse getExamScheduleDetail(Long id) {
                ExamSchedule examSchedule = examScheduleRepository.findById(id)
                                .orElseThrow(() -> new AppException(ErrorCode.EXAM_SCHEDULE_NOT_FOUND));

                List<ExamScheduleDetailResponse.LearnerInfo> learners = null;
                if (examSchedule.getClassField() != null) {
                        List<Enrollment> enrollments = enrollmentRepository
                                        .findByClassFieldId(examSchedule.getClassField().getId());
                        learners = enrollments.stream()
                                        .map(this::convertToLearnerInfo)
                                        .collect(Collectors.toList());
                }

                return ExamScheduleDetailResponse.builder()
                                .id(examSchedule.getId())
                                .examName(examSchedule.getExam().getExamName())
                                .className(examSchedule.getClassField() != null
                                                ? examSchedule.getClassField().getClassName()
                                                : null)
                                .instructorName(examSchedule.getInstructor() != null
                                                ? (examSchedule.getInstructor().getFirstName() + " "
                                                                + examSchedule.getInstructor().getLastName())
                                                : null)
                                .examDate(examSchedule.getExamDate())
                                .startTime(examSchedule.getStartTime())
                                .location(examSchedule.getLocation())
                                .maxParticipants(examSchedule.getMaxParticipants())
                                .learners(learners)
                                .build();
        }

        @Override
        public List<LearnerExamScheduleResponse> getExamSchedulesForLearner(Long learnerId) {
                User learner = userRepository.findById(learnerId)
                                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));

                List<ExamSchedule> examSchedules = examScheduleRepository.findByClassFieldLearnersId(learner.getId());

                if (examSchedules.isEmpty()) {
                        return List.of();
                }

                return examSchedules.stream()
                                .map(examSchedule -> convertToLearnerExamScheduleResponse(examSchedule,
                                                learner.getId()))
                                .collect(Collectors.toList());
        }

        private ExamScheduleResponse convertToResponse(ExamSchedule examSchedule) {
                return new ExamScheduleResponse(
                                examSchedule.getId(),
                                examSchedule.getExam().getExamName(),
                                examSchedule.getClassField() != null ? examSchedule.getClassField().getClassName()
                                                : null,
                                examSchedule.getExamDate(),
                                examSchedule.getStartTime(),
                                examSchedule.getLocation(),
                                examSchedule.getMaxParticipants(),
                                examSchedule.getInstructor() != null
                                                ? (examSchedule.getInstructor().getFirstName() + " " +
                                                                examSchedule.getInstructor().getLastName())
                                                : null,
                                examSchedule.getExam().getPassScore());
        }

        private ExamScheduleDetailResponse.LearnerInfo convertToLearnerInfo(Enrollment enrollment) {
                return ExamScheduleDetailResponse.LearnerInfo.builder()
                                .id(enrollment.getLearner().getId())
                                .firstName(enrollment.getLearner().getFirstName())
                                .lastName(enrollment.getLearner().getLastName())
                                .email(enrollment.getLearner().getEmail())
                                .phone(enrollment.getLearner().getLearnerProfile() != null
                                                ? enrollment.getLearner().getLearnerProfile().getPhoneNumber()
                                                : null)
                                .status(String.valueOf(enrollment.getStatus()))
                                .build();
        }

        private LearnerExamScheduleResponse convertToLearnerExamScheduleResponse(ExamSchedule examSchedule,
                        Long learnerId) {
                String registrationStatus = "NOT_REGISTERED";
                String examResult = "N/A";

                Optional<ExamRegistration> registration = examRegistrationRepository
                                .findByExamSchedule_IdAndLearner_Id(examSchedule.getId(), learnerId);

                if (registration.isPresent()) {
                        registrationStatus = registration.get().getStatus();

                        List<ExamResult> results = examResultRepository
                                        .findByLearnerIdAndExamScheduleId(learnerId, examSchedule.getId());

                        if (!results.isEmpty()) {
                                examResult = results.get(0).getScore() != null ? results.get(0).getScore().toString()
                                                : "N/A";
                        }
                }

                return LearnerExamScheduleResponse.builder()
                                .id(examSchedule.getId())
                                .examName(examSchedule.getExam().getExamName())
                                .examType(examSchedule.getExam().getExamType() != null
                                                ? examSchedule.getExam().getExamType().toString()
                                                : "N/A")
                                .className(examSchedule.getClassField() != null
                                                ? examSchedule.getClassField().getClassName()
                                                : "N/A")
                                .examDate(examSchedule.getExamDate())
                                .startTime(examSchedule.getStartTime())
                                .location(examSchedule.getLocation())
                                .instructorName(examSchedule.getInstructor() != null
                                                ? (examSchedule.getInstructor().getFirstName() + " " +
                                                                examSchedule.getInstructor().getLastName())
                                                : "N/A")
                                .registrationStatus(registrationStatus)
                                .examResult(examResult)
                                .build();
        }
}
