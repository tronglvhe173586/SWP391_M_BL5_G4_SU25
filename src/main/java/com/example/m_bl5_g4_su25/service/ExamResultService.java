package com.example.m_bl5_g4_su25.service;

import com.example.m_bl5_g4_su25.dto.request.ExamResultCreateRequest;
import com.example.m_bl5_g4_su25.dto.response.ExamResultResponse;
import com.example.m_bl5_g4_su25.dto.request.ExamResultUpdateRequest;
import com.example.m_bl5_g4_su25.entity.ExamResult;
import com.example.m_bl5_g4_su25.entity.ExamSchedule;
import com.example.m_bl5_g4_su25.entity.User;
import com.example.m_bl5_g4_su25.exception.AppException;
import com.example.m_bl5_g4_su25.exception.ErrorCode;
import com.example.m_bl5_g4_su25.repository.ExamResultRepository;
import com.example.m_bl5_g4_su25.repository.ExamScheduleRepository;
import com.example.m_bl5_g4_su25.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class ExamResultService implements IExamResultService {

        private final ExamResultRepository examResultRepository;
        private final ExamScheduleRepository examScheduleRepository;
        private final UserRepository userRepository;

        @Override
        public List<ExamResultResponse> getExamResultsByExamSchedule(Long examScheduleId) {
                List<ExamResult> examResults = examResultRepository.findByExamScheduleId(examScheduleId);
                return examResults.stream()
                                .map(this::convertToResponse)
                                .collect(Collectors.toList());
        }

        @Override
        public List<ExamResultResponse> getAllExamResults() {
                List<ExamResult> examResults = examResultRepository.findAll();
                return examResults.stream()
                                .map(this::convertToResponse)
                                .collect(Collectors.toList());
        }

        @Override
        @Transactional
        public ExamResultResponse createExamResult(ExamResultCreateRequest request) {
                // Validate learner exists
                User learner = userRepository.findById(request.getLearnerId())
                                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));

                // Validate exam schedule exists
                ExamSchedule examSchedule = examScheduleRepository.findById(request.getExamScheduleId())
                                .orElseThrow(() -> new AppException(ErrorCode.EXAM_SCHEDULE_NOT_FOUND));

                // Check if exam result already exists for this learner and exam schedule
                List<ExamResult> existingResults = examResultRepository.findByLearnerIdAndExamScheduleId(
                                request.getLearnerId(), request.getExamScheduleId());

                if (!existingResults.isEmpty()) {
                        throw new AppException(ErrorCode.EXAM_RESULT_ALREADY_EXISTS);
                }

                // Calculate pass status based on score and exam pass score
                // The pass score is automatically retrieved from the exam configuration in the
                // Exam table
                boolean isPassed = request.getScore()
                                .compareTo(BigDecimal.valueOf(examSchedule.getExam().getPassScore())) >= 0;

                // Create and save exam result
                ExamResult examResult = ExamResult.builder()
                                .learner(learner)
                                .examSchedule(examSchedule)
                                .score(request.getScore())
                                .isPassed(isPassed)
                                .resultDate(Instant.now())
                                .build();

                ExamResult savedResult = examResultRepository.save(examResult);

                log.info("Created exam result for learner {} in exam schedule {} with score {} and pass status: {}",
                                learner.getUsername(), examSchedule.getId(), request.getScore(), isPassed);

                return convertToResponse(savedResult);
        }

        @Override
        public ExamResultResponse getExamResultById(Long id) {
                ExamResult examResult = examResultRepository.findById(id)
                                .orElseThrow(() -> new AppException(ErrorCode.EXAM_RESULT_NOT_FOUND));
                return convertToResponse(examResult);
        }

        @Override
        @Transactional
        public ExamResultResponse updateExamResult(Long id, ExamResultUpdateRequest request) {
                ExamResult examResult = examResultRepository.findById(id)
                                .orElseThrow(() -> new AppException(ErrorCode.EXAM_RESULT_NOT_FOUND));

                ExamSchedule examSchedule = examResult.getExamSchedule();
                boolean isPassed = request.getScore()
                                .compareTo(BigDecimal.valueOf(examSchedule.getExam().getPassScore())) >= 0;

                examResult.setScore(request.getScore());
                examResult.setIsPassed(isPassed);
                examResult.setResultDate(Instant.now());

                ExamResult saved = examResultRepository.save(examResult);
                return convertToResponse(saved);
        }

        @Override
        public List<ExamResultResponse> getExamResultsForLearner(Long learnerId) {
                List<ExamResult> results = examResultRepository.findByLearnerId(learnerId);
                return results.stream().map(this::convertToResponse).collect(Collectors.toList());
        }

        private ExamResultResponse convertToResponse(ExamResult examResult) {
                return ExamResultResponse.builder()
                                .id(examResult.getId())
                                .learnerId(examResult.getLearner().getId())
                                .learnerName(examResult.getLearner().getFirstName() + " "
                                                + examResult.getLearner().getLastName())
                                .learnerEmail(examResult.getLearner().getEmail())
                                .examScheduleId(examResult.getExamSchedule().getId())
                                .examName(examResult.getExamSchedule().getExam().getExamName())
                                .examType(examResult.getExamSchedule().getExam().getExamType().toString())
                                .className(examResult.getExamSchedule().getClassField() != null
                                                ? examResult.getExamSchedule().getClassField().getClassName()
                                                : "N/A")
                                .examDate(examResult.getExamSchedule().getExamDate())
                                .startTime(examResult.getExamSchedule().getStartTime())
                                .location(examResult.getExamSchedule().getLocation())
                                .instructorName(examResult.getExamSchedule().getInstructor() != null
                                                ? examResult.getExamSchedule().getInstructor().getFirstName() + " " +
                                                                examResult.getExamSchedule().getInstructor()
                                                                                .getLastName()
                                                : "N/A")
                                .score(examResult.getScore())
                                .isPassed(examResult.getIsPassed())
                                .resultDate(examResult.getResultDate())
                                .passScore(examResult.getExamSchedule().getExam().getPassScore())
                                .build();
        }
}
