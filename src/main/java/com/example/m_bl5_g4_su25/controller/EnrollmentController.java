package com.example.m_bl5_g4_su25.controller;

import com.example.m_bl5_g4_su25.dto.request.AddLearnerToClassRequest;
import com.example.m_bl5_g4_su25.entity.Enrollment;
import com.example.m_bl5_g4_su25.service.EnrollmentService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/enrollments")
@RequiredArgsConstructor
public class EnrollmentController {
    
    private final EnrollmentService enrollmentService;
    
    @PostMapping("/add-learner")
    public ResponseEntity<?> addLearnerToClass(@Valid @RequestBody AddLearnerToClassRequest request) {
        try {
            Enrollment enrollment = enrollmentService.addLearnerToClass(request);
            return ResponseEntity.ok().body("Learner successfully added to class. Enrollment ID: " + enrollment.getId());
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body("Error: " + e.getMessage());
        }
    }
    
    @GetMapping("/check/{learnerId}/{classId}")
    public ResponseEntity<Boolean> checkEnrollment(@PathVariable Long learnerId, @PathVariable Long classId) {
        boolean isEnrolled = enrollmentService.isLearnerEnrolledInClass(learnerId, classId);
        return ResponseEntity.ok(isEnrolled);
    }
}
