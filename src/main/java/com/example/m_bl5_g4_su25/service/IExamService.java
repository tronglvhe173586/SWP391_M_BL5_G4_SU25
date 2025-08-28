package com.example.m_bl5_g4_su25.service;

import com.example.m_bl5_g4_su25.dto.response.ExamResponse;
import com.example.m_bl5_g4_su25.entity.Exam;
import org.springframework.data.domain.Page;

import java.util.List;

public interface IExamService {
    public List<ExamResponse> getAllExams();

    public Page<ExamResponse> getAllExamsPagination(String keyword, int page, int size);

    public ExamResponse getExamById(Long examId);

    public ExamResponse createExam(Exam exam);

    public ExamResponse updateExam(Long examId, Exam exam);
}
