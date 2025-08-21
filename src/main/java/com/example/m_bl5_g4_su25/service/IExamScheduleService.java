package com.example.m_bl5_g4_su25.service;

import com.example.m_bl5_g4_su25.dto.request.ExamScheduleCreateRequest;
import com.example.m_bl5_g4_su25.dto.response.ExamScheduleResponse;
import java.util.List;

public interface IExamScheduleService {
    List<ExamScheduleResponse> getAllExamSchedules();

    ExamScheduleResponse createExamSchedule(ExamScheduleCreateRequest request);
}
