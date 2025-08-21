package com.example.m_bl5_g4_su25.controller;

import com.example.m_bl5_g4_su25.dto.request.ExamScheduleCreateRequest;
import com.example.m_bl5_g4_su25.dto.response.ApiResponse;
import com.example.m_bl5_g4_su25.dto.response.ExamScheduleResponse;
import com.example.m_bl5_g4_su25.service.ExamScheduleService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
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

    @PostMapping
    public ResponseEntity<ApiResponse<ExamScheduleResponse>> createExamSchedule(
            @Valid @RequestBody ExamScheduleCreateRequest request) {
        ExamScheduleResponse createdExamSchedule = examScheduleService.createExamSchedule(request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.<ExamScheduleResponse>builder()
                        .result(createdExamSchedule)
                        .build());
    }
}
