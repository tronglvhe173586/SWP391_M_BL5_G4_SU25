package com.example.m_bl5_g4_su25.controller;

import com.example.m_bl5_g4_su25.dto.request.ExamScheduleCreateRequest;
import com.example.m_bl5_g4_su25.dto.request.ExamScheduleUpdateRequest;
import com.example.m_bl5_g4_su25.dto.response.ApiResponse;
import com.example.m_bl5_g4_su25.dto.response.ExamScheduleDetailResponse;
import com.example.m_bl5_g4_su25.dto.response.ExamScheduleResponse;
import com.example.m_bl5_g4_su25.service.IExamScheduleService;
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
    private IExamScheduleService examScheduleService;

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

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<ExamScheduleResponse>> getExamSchedule(@PathVariable Long id) {
        ExamScheduleResponse response = examScheduleService.getExamScheduleById(id);
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    @GetMapping("/{id}/detail")
    public ResponseEntity<ApiResponse<ExamScheduleDetailResponse>> getExamScheduleDetail(@PathVariable Long id) {
        ExamScheduleDetailResponse response = examScheduleService.getExamScheduleDetail(id);
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<ExamScheduleResponse>> updateExamSchedule(
            @PathVariable Long id,
            @Valid @RequestBody ExamScheduleUpdateRequest request) {
        ExamScheduleResponse updated = examScheduleService.updateExamSchedule(id, request);
        return ResponseEntity.ok(ApiResponse.success("Updated exam schedule", updated));
    }
}
