package com.example.m_bl5_g4_su25.service;

import com.example.m_bl5_g4_su25.dto.response.ExamResponse;
import com.example.m_bl5_g4_su25.entity.Exam;

import java.util.List;

public interface IExamService {
    public List<ExamResponse> getAllExams();
}
