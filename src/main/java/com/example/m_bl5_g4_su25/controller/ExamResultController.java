package com.example.m_bl5_g4_su25.controller;

import com.example.m_bl5_g4_su25.dto.request.ExamResultCreateRequest;
import com.example.m_bl5_g4_su25.dto.request.ExamResultUpdateRequest;
import com.example.m_bl5_g4_su25.dto.response.ApiResponse;
import com.example.m_bl5_g4_su25.dto.response.ExamResultResponse;
import com.example.m_bl5_g4_su25.service.IExamResultService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.jwt.Jwt;

import jakarta.validation.Valid;
import java.util.List;

@RestController
@RequestMapping("/exam-results")
@RequiredArgsConstructor
public class ExamResultController {

        private final IExamResultService examResultService;

        /**
         * Get all exam results across all exam schedules (Admin only)
         */
        @GetMapping
        // @PreAuthorize("hasAuthority('ROLE_ADMIN')")
        public ResponseEntity<ApiResponse<List<ExamResultResponse>>> getAllExamResults() {
                List<ExamResultResponse> results = examResultService.getAllExamResults();
                return ResponseEntity.ok(ApiResponse.<List<ExamResultResponse>>builder()
                                .result(results)
                                .build());
        }

        /**
         * Get exam results for a specific exam schedule (Admin only)
         */
        @GetMapping("/exam-schedule/{examScheduleId}")
        // @PreAuthorize("hasAuthority('ROLE_ADMIN')")
        public ResponseEntity<ApiResponse<List<ExamResultResponse>>> getExamResultsByExamSchedule(
                        @PathVariable Long examScheduleId) {
                List<ExamResultResponse> results = examResultService.getExamResultsByExamSchedule(examScheduleId);
                return ResponseEntity.ok(ApiResponse.<List<ExamResultResponse>>builder()
                                .result(results)
                                .build());
        }

        /**
         * Create a new exam result for a learner (Admin only)
         */
        @PostMapping
        // @PreAuthorize("hasAuthority('ROLE_ADMIN')")
        public ResponseEntity<ApiResponse<ExamResultResponse>> createExamResult(
                        @Valid @RequestBody ExamResultCreateRequest request) {
                ExamResultResponse result = examResultService.createExamResult(request);
                return ResponseEntity.status(HttpStatus.CREATED)
                                .body(ApiResponse.<ExamResultResponse>builder()
                                                .result(result)
                                                .build());
        }

        /**
         * Get current learner's exam results
         */
        @GetMapping("/my")
        public ResponseEntity<ApiResponse<List<ExamResultResponse>>> getMyExamResults() {
                Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
                Jwt jwt = (Jwt) authentication.getPrincipal();
                Long learnerId = Long.valueOf(jwt.getClaim("userId").toString());
                List<ExamResultResponse> results = examResultService.getExamResultsForLearner(learnerId);
                return ResponseEntity.ok(ApiResponse.<List<ExamResultResponse>>builder().result(results).build());
        }

        /**
         * Get a single exam result by id
         */
        @GetMapping("/{id}")
        public ResponseEntity<ApiResponse<ExamResultResponse>> getExamResult(@PathVariable Long id) {
                ExamResultResponse result = examResultService.getExamResultById(id);
                return ResponseEntity.ok(ApiResponse.<ExamResultResponse>builder().result(result).build());
        }

        /**
         * Update an existing exam result's score (Admin only)
         */
        @PutMapping("/{id}")
        // @PreAuthorize("hasAuthority('ROLE_ADMIN')")
        public ResponseEntity<ApiResponse<ExamResultResponse>> updateExamResult(
                        @PathVariable Long id,
                        @Valid @RequestBody ExamResultUpdateRequest request) {
                ExamResultResponse result = examResultService.updateExamResult(id, request);
                return ResponseEntity.ok(ApiResponse.<ExamResultResponse>builder().result(result).build());
        }
}
