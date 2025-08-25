package com.example.m_bl5_g4_su25.service;

import com.example.m_bl5_g4_su25.dto.request.ExamResultCreateRequest;
import com.example.m_bl5_g4_su25.dto.request.ExamResultUpdateRequest;
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

    /**
     * Update an existing exam result's score and pass status
     *
     * @param id      the exam result id
     * @param request the update request containing new score
     * @return the updated exam result
     */
    ExamResultResponse updateExamResult(Long id, ExamResultUpdateRequest request);

    /**
     * Get a single exam result by id
     *
     * @param id the exam result id
     * @return the exam result
     */
    ExamResultResponse getExamResultById(Long id);

    /**
     * Get exam results for a specific learner
     * 
     * @param learnerId learner id
     * @return list of results
     */
    List<ExamResultResponse> getExamResultsForLearner(Long learnerId);
}
