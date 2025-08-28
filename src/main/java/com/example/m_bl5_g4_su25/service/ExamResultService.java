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
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.PageImpl;

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
        public Page<ExamResultResponse> getAllExamResultsPagination(String keyword, int page, int size) {
                Pageable pageable = PageRequest.of(page, size);

                Page<ExamResult> examResultPage;
                if (keyword != null && !keyword.trim().isEmpty()) {
                        examResultPage = examResultRepository.findByKeyword(keyword, pageable);
                } else {
                        examResultPage = examResultRepository.findAll(pageable);
                }

                return examResultPage.map(this::convertToResponse);
        }

        @Override
        public Page<ExamResultResponse> getExamResultsByExamSchedulePagination(Long examScheduleId, String keyword,
                        int page, int size) {
                Pageable pageable = PageRequest.of(page, size);

                Page<ExamResult> examResultPage;
                if (keyword != null && !keyword.trim().isEmpty()) {
                        examResultPage = examResultRepository.findByExamScheduleIdAndKeyword(examScheduleId, keyword,
                                        pageable);
                } else {
                        // For exam schedule specific results without keyword, we need to filter by exam
                        // schedule ID
                        List<ExamResult> allResults = examResultRepository.findByExamScheduleId(examScheduleId);
                        // Convert to page manually since we don't have a direct repository method
                        int start = (int) pageable.getOffset();
                        int end = Math.min((start + pageable.getPageSize()), allResults.size());

                        List<ExamResult> pageContent = allResults.subList(start, end);
                        return new PageImpl<>(pageContent, pageable, allResults.size())
                                        .map(this::convertToResponse);
                }

                return examResultPage.map(this::convertToResponse);
        }

        @Override
        @Transactional
        public ExamResultResponse createExamResult(ExamResultCreateRequest request) {
                User learner = userRepository.findById(request.getLearnerId())
                                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));

                ExamSchedule examSchedule = examScheduleRepository.findById(request.getExamScheduleId())
                                .orElseThrow(() -> new AppException(ErrorCode.EXAM_SCHEDULE_NOT_FOUND));

                List<ExamResult> existingResults = examResultRepository.findByLearnerIdAndExamScheduleId(
                                request.getLearnerId(), request.getExamScheduleId());

                if (!existingResults.isEmpty()) {
                        throw new AppException(ErrorCode.EXAM_RESULT_ALREADY_EXISTS);
                }

                boolean isPassed = request.getScore()
                                .compareTo(BigDecimal.valueOf(examSchedule.getExam().getPassScore())) >= 0;

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
