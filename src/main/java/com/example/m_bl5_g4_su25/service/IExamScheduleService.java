package com.example.m_bl5_g4_su25.service;

import com.example.m_bl5_g4_su25.dto.request.ExamScheduleCreateRequest;
import com.example.m_bl5_g4_su25.dto.request.ExamScheduleUpdateRequest;
import com.example.m_bl5_g4_su25.dto.response.ExamScheduleDetailResponse;
import com.example.m_bl5_g4_su25.dto.response.ExamScheduleResponse;
import com.example.m_bl5_g4_su25.dto.response.LearnerExamScheduleResponse;
import java.util.List;

public interface IExamScheduleService {
    List<ExamScheduleResponse> getAllExamSchedules();

    ExamScheduleResponse getExamScheduleById(Long id);

    ExamScheduleResponse updateExamSchedule(Long id, ExamScheduleUpdateRequest request);

    ExamScheduleDetailResponse getExamScheduleDetail(Long id);

    ExamScheduleResponse createExamSchedule(ExamScheduleCreateRequest request);

    List<LearnerExamScheduleResponse> getExamSchedulesForLearner(Long learnerId);

    List<ExamScheduleResponse> getExamSchedulesForInstructor(Long instructorId);

}
