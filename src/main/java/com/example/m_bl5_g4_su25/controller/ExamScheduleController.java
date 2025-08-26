package com.example.m_bl5_g4_su25.controller;

import com.example.m_bl5_g4_su25.dto.request.ExamScheduleCreateRequest;
import com.example.m_bl5_g4_su25.dto.request.ExamScheduleUpdateRequest;
import com.example.m_bl5_g4_su25.dto.response.ApiResponse;
import com.example.m_bl5_g4_su25.dto.response.ExamScheduleDetailResponse;
import com.example.m_bl5_g4_su25.dto.response.ExamScheduleResponse;
import com.example.m_bl5_g4_su25.dto.response.LearnerExamScheduleResponse;
import com.example.m_bl5_g4_su25.service.IExamScheduleService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.jwt.Jwt;
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

    @GetMapping("/learner/{learnerId}")
    //@PreAuthorize("hasAuthority('ROLE_LEARNER') and #learnerId == T(java.lang.Long).valueOf(authentication.principal.claims['userId'].toString())")
    public ResponseEntity<ApiResponse<List<LearnerExamScheduleResponse>>> getExamSchedulesForLearner(
            @PathVariable Long learnerId) {
        List<LearnerExamScheduleResponse> response = examScheduleService.getExamSchedulesForLearner(learnerId);
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    @GetMapping("/learner/my-schedules")
    //@PreAuthorize("hasAuthority('ROLE_LEARNER')")
    public ResponseEntity<ApiResponse<List<LearnerExamScheduleResponse>>> getMyExamSchedules() {
        // Get current authenticated user's ID from JWT token
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        System.out.println("Authentication: " + authentication);
        System.out.println("Principal: " + authentication.getPrincipal());
        System.out.println("Authorities: " + authentication.getAuthorities());

        Jwt jwt = (Jwt) authentication.getPrincipal();
        System.out.println("JWT Claims: " + jwt.getClaims());
        System.out.println("User ID from JWT: " + jwt.getClaim("userId"));
        System.out.println("Role from JWT: " + jwt.getClaim("role"));

        Long learnerId = Long.valueOf(jwt.getClaim("userId").toString());

        List<LearnerExamScheduleResponse> response = examScheduleService.getExamSchedulesForLearner(learnerId);
        return ResponseEntity.ok(ApiResponse.success(response));
    }
}
