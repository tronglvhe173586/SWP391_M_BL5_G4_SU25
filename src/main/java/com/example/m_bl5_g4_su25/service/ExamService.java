package com.example.m_bl5_g4_su25.service;

import com.example.m_bl5_g4_su25.dto.response.ExamResponse;
import com.example.m_bl5_g4_su25.entity.Exam;
import com.example.m_bl5_g4_su25.repository.ExamRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class ExamService implements IExamService {

    @Autowired
    private ExamRepository examRepository;

    public List<ExamResponse> getAllExams() {
        List<Exam> exams = examRepository.findAll();
        return exams.stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    private ExamResponse convertToResponse(Exam exam) {
        return new ExamResponse(
                exam.getId(),
                exam.getExamName(),
                exam.getExamType(),
                exam.getPassScore());
    }
}
