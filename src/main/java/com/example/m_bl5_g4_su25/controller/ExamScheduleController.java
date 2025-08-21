package com.example.m_bl5_g4_su25.controller;

import com.example.m_bl5_g4_su25.dto.response.ApiResponse;
import com.example.m_bl5_g4_su25.dto.response.ExamScheduleResponse;
import com.example.m_bl5_g4_su25.service.ExamScheduleService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/exam-schedules")
public class ExamScheduleController {

    @Autowired
    private ExamScheduleService examScheduleService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<ExamScheduleResponse>>> getAllExamSchedules() {
        List<ExamScheduleResponse> examSchedules = examScheduleService.getAllExamSchedules();
        return ResponseEntity.ok(ApiResponse.<List<ExamScheduleResponse>>builder()
                .result(examSchedules)
                .build());
    }
}
