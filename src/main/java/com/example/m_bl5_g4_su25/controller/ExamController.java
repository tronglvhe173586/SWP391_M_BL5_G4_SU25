package com.example.m_bl5_g4_su25.controller;

import com.example.m_bl5_g4_su25.dto.request.ExamCreateRequest;
import com.example.m_bl5_g4_su25.dto.request.ExamUpdateRequest;
import com.example.m_bl5_g4_su25.dto.response.ExamResponse;
import com.example.m_bl5_g4_su25.entity.Exam;
import com.example.m_bl5_g4_su25.service.ExamService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import java.util.List;

@RestController
@RequestMapping("/exams")
public class ExamController {

    @Autowired
    private ExamService examService;

    @GetMapping
    public ResponseEntity<List<ExamResponse>> getAllExams() {
        List<ExamResponse> exams = examService.getAllExams();
        return ResponseEntity.ok(exams);
    }

    @GetMapping("/{examId}")
    public ResponseEntity<ExamResponse> getExamById(@PathVariable Long examId) {
        ExamResponse exam = examService.getExamById(examId);
        return ResponseEntity.ok(exam);
    }

    @PostMapping
    public ResponseEntity<ExamResponse> createExam(@Valid @RequestBody ExamCreateRequest examCreateRequest) {
        Exam exam = new Exam();
        exam.setExamName(examCreateRequest.getExamName());
        exam.setExamType(examCreateRequest.getExamType());
        exam.setPassScore(examCreateRequest.getPassScore());

        ExamResponse createdExam = examService.createExam(exam);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdExam);
    }

    @PutMapping("/{examId}")
    public ResponseEntity<ExamResponse> updateExam(
            @PathVariable Long examId,
            @Valid @RequestBody ExamUpdateRequest examUpdateRequest) {
        Exam examDetails = new Exam();
        examDetails.setExamName(examUpdateRequest.getExamName());
        examDetails.setExamType(examUpdateRequest.getExamType());
        examDetails.setPassScore(examUpdateRequest.getPassScore());

        ExamResponse updatedExam = examService.updateExam(examId, examDetails);
        return ResponseEntity.ok(updatedExam);
    }
}
