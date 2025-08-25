package com.example.m_bl5_g4_su25.service;

import com.example.m_bl5_g4_su25.dto.request.ExamResultCreateRequest;
import com.example.m_bl5_g4_su25.dto.response.ExamResultResponse;
import java.util.List;

public interface IExamResultService {
    /**
     * Get all exam results for a specific exam schedule
     * 
     * @param examScheduleId the ID of the exam schedule
     * @return list of exam results
     */
    List<ExamResultResponse> getExamResultsByExamSchedule(Long examScheduleId);

    /**
     * Get all exam results across all exam schedules
     * 
     * @return list of all exam results
     */
    List<ExamResultResponse> getAllExamResults();

    /**
     * Create a new exam result for a learner
     * 
     * @param request the exam result creation request
     * @return the created exam result
     */
    ExamResultResponse createExamResult(ExamResultCreateRequest request);
}
