package com.example.m_bl5_g4_su25.controller;

import com.example.m_bl5_g4_su25.dto.response.ExamResultResponse;
import com.example.m_bl5_g4_su25.service.ExamResultService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/exam-results")
@RequiredArgsConstructor
public class ExamResultController {
    
    private final ExamResultService examResultService;
    
    @GetMapping("/learner/{learnerId}")
    public ResponseEntity<List<ExamResultResponse>> getExamResultsByLearner(@PathVariable Long learnerId) {
        List<ExamResultResponse> examResults = examResultService.getExamResultsByLearnerId(learnerId);
        return ResponseEntity.ok(examResults);
    }
}
