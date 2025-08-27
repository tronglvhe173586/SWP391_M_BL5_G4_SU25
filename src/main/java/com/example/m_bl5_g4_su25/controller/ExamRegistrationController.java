package com.example.m_bl5_g4_su25.controller;

import com.example.m_bl5_g4_su25.dto.request.ExamRegistrationCreateRequest;
import com.example.m_bl5_g4_su25.dto.request.UpdateExamRegistrationStatusRequest;
import com.example.m_bl5_g4_su25.dto.response.ApiResponse;
import com.example.m_bl5_g4_su25.dto.response.ExamRegistrationManagementResponse;
import com.example.m_bl5_g4_su25.service.ExamRegistrationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/exam-registrations")
@RequiredArgsConstructor
public class ExamRegistrationController {

    private final ExamRegistrationService examRegistrationService;

    @PostMapping("/course/{courseId}")
    public ResponseEntity<ApiResponse<String>> registerForCourse(@PathVariable Long courseId,
            @RequestBody ExamRegistrationCreateRequest request) {
        return ResponseEntity.ok(examRegistrationService.registerForCourse(courseId, request));
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<ExamRegistrationManagementResponse>>> getAllRegistrations() {
        return ResponseEntity.ok(examRegistrationService.getAllRegistrations());
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<ApiResponse<String>> updateStatus(
            @PathVariable Long id,
            @RequestBody UpdateExamRegistrationStatusRequest request) {
        return ResponseEntity.ok(examRegistrationService.updateStatus(id, request));
    }

    @PutMapping("/course/{courseId}/exam-schedule/{examScheduleId}/status")
    public ResponseEntity<ApiResponse<String>> updateCourseScheduleStatus(
            @PathVariable Long courseId,
            @PathVariable Long examScheduleId,
            @RequestBody UpdateExamRegistrationStatusRequest request) {
        return ResponseEntity.ok(examRegistrationService
                .updateCourseScheduleStatus(courseId, examScheduleId, request.getStatus()));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<String>> deleteRegistration(@PathVariable Long id) {
        return ResponseEntity.ok(examRegistrationService.deleteRegistration(id));
    }

    @GetMapping("/statuses")
    public ResponseEntity<ApiResponse<Map<Long, String>>> getStatuses(@RequestParam("examScheduleIds") List<Long> examScheduleIds) {
        return ResponseEntity.ok(examRegistrationService.getStatusesForSchedules(examScheduleIds));
    }

    @GetMapping("/course/{courseId}/statuses")
    public ResponseEntity<ApiResponse<Map<Long, String>>> getCourseStatuses(
            @PathVariable Long courseId,
            @RequestParam("examScheduleIds") List<Long> examScheduleIds) {
        return ResponseEntity.ok(examRegistrationService.getCourseStatusesForSchedules(courseId, examScheduleIds));
    }

}


