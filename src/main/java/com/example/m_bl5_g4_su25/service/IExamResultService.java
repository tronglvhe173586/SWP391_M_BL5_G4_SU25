package com.example.m_bl5_g4_su25.service;

import com.example.m_bl5_g4_su25.dto.request.ExamResultCreateRequest;
import com.example.m_bl5_g4_su25.dto.request.ExamResultUpdateRequest;
import com.example.m_bl5_g4_su25.dto.response.ExamResultResponse;
import org.springframework.data.domain.Page;
import java.util.List;

public interface IExamResultService {

    List<ExamResultResponse> getExamResultsByExamSchedule(Long examScheduleId);

    Page<ExamResultResponse> getExamResultsByExamSchedulePagination(Long examScheduleId, String keyword, int page,
            int size);

    List<ExamResultResponse> getAllExamResults();

    Page<ExamResultResponse> getAllExamResultsPagination(String keyword, int page, int size);

    ExamResultResponse createExamResult(ExamResultCreateRequest request);

    ExamResultResponse updateExamResult(Long id, ExamResultUpdateRequest request);

    ExamResultResponse getExamResultById(Long id);

    List<ExamResultResponse> getExamResultsForLearner(Long learnerId);
}
