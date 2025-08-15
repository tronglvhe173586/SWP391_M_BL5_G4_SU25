package com.example.m_bl5_g4_su25.service;

import com.example.m_bl5_g4_su25.dto.response.ExamResultResponse;
import com.example.m_bl5_g4_su25.entity.ExamResult;
import com.example.m_bl5_g4_su25.repository.ExamResultRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ExamResultService {
    
    private final ExamResultRepository examResultRepository;
    
    public List<ExamResultResponse> getExamResultsByLearnerId(Long learnerId) {
        List<ExamResult> examResults = examResultRepository.findExamResultsByLearnerId(learnerId);
        return examResults.stream()
                .map(this::convertToExamResultResponse)
                .collect(Collectors.toList());
    }
    
    private ExamResultResponse convertToExamResultResponse(ExamResult examResult) {
        ExamResultResponse response = new ExamResultResponse();
        
        // User information
        response.setUserId(examResult.getLearner().getId());
        response.setUsername(examResult.getLearner().getUsername());
        response.setFullName(examResult.getLearner().getFullName());
        
        // Exam information
        response.setExamName(examResult.getExamSchedule().getExam().getExamName());
        response.setExamType(examResult.getExamSchedule().getExam().getExamType());
        response.setPassScore(examResult.getExamSchedule().getExam().getPassScore());
        response.setMaxScore(100); // Default max score for most exams
        
        // Exam schedule information
        response.setExamDate(examResult.getExamSchedule().getExamDate());
        response.setStartTime(examResult.getExamSchedule().getStartTime());
        response.setLocation(examResult.getExamSchedule().getLocation());
        
        // Result information
        response.setScore(examResult.getScore());
        response.setIsPassed(examResult.getIsPassed());
        response.setResultDate(examResult.getResultDate());
        
        return response;
    }
}
