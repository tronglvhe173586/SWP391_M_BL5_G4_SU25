package com.example.m_bl5_g4_su25.service;

import com.example.m_bl5_g4_su25.dto.request.ExamScheduleUpdateRequest;
import com.example.m_bl5_g4_su25.dto.response.ExamScheduleResponse;
import java.util.List;

public interface IExamScheduleService {
    List<ExamScheduleResponse> getAllExamSchedules();

    ExamScheduleResponse getExamScheduleById(Long id);

    ExamScheduleResponse updateExamSchedule(Long id, ExamScheduleUpdateRequest request);
}
