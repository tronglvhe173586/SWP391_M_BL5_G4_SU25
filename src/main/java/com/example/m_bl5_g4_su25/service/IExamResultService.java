package com.example.m_bl5_g4_su25.service;

import com.example.m_bl5_g4_su25.dto.request.ExamResultCreateRequest;
import com.example.m_bl5_g4_su25.dto.request.ExamResultUpdateRequest;
import com.example.m_bl5_g4_su25.dto.response.ExamResultResponse;
import java.util.List;

public interface IExamResultService {

    List<ExamResultResponse> getExamResultsByExamSchedule(Long examScheduleId);

    List<ExamResultResponse> getAllExamResults();

    ExamResultResponse createExamResult(ExamResultCreateRequest request);

    ExamResultResponse updateExamResult(Long id, ExamResultUpdateRequest request);

    ExamResultResponse getExamResultById(Long id);

    List<ExamResultResponse> getExamResultsForLearner(Long learnerId);
}
