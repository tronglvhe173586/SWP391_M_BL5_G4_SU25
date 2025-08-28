package com.example.m_bl5_g4_su25.controller;

import com.example.m_bl5_g4_su25.dto.request.AddEnrollmentRequest;
import com.example.m_bl5_g4_su25.dto.request.EditEnrollmentRequest;
import com.example.m_bl5_g4_su25.dto.response.EnrollmentResponse;
import com.example.m_bl5_g4_su25.service.IEnrollmentService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/enrollments")
public class EnrollmentController {

    @Autowired
    private IEnrollmentService enrollmentService;

    @GetMapping
    public ResponseEntity<List<EnrollmentResponse>> listLearnersInClass(@RequestParam(required = false) Long classId) {
        List<EnrollmentResponse> enrollments = enrollmentService.listLearnersInClass(classId);
        return ResponseEntity.ok(enrollments);
    }

    @PostMapping
    public ResponseEntity<EnrollmentResponse> addEnrollment(@Valid @RequestBody AddEnrollmentRequest request) {
        EnrollmentResponse createdEnrollment = enrollmentService.addEnrollment(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdEnrollment);
    }

    @GetMapping("/{enrollmentId}")
    public ResponseEntity<EnrollmentResponse> getEnrollmentById(@PathVariable Long enrollmentId) {
        EnrollmentResponse enrollment = enrollmentService.getEnrollmentById(enrollmentId);
        return ResponseEntity.ok(enrollment);
    }

    @PutMapping("/{enrollmentId}")
    public ResponseEntity<EnrollmentResponse> updateEnrollment(
            @PathVariable Long enrollmentId,
            @Valid @RequestBody EditEnrollmentRequest request) {
        EnrollmentResponse updatedEnrollment = enrollmentService.updateEnrollment(enrollmentId, request);
        return ResponseEntity.ok(updatedEnrollment);
    }
}