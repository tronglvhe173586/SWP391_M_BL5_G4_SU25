package com.example.m_bl5_g4_su25.controller;

<<<<<<< HEAD
import com.example.m_bl5_g4_su25.dto.response.UserResponse;
import com.example.m_bl5_g4_su25.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
=======
//import org.springframework.stereotype.Controller;
>>>>>>> 6eef93d50ba4d527324154db67ec77c514e53a4b
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    @GetMapping("/hello")
    public String hello() {
        return "Hello from Spring Boot!";
    }

    @GetMapping("/instructor/{instructorId}/learners")
    public ResponseEntity<List<UserResponse>> getLearnersByInstructor(@PathVariable Long instructorId) {
        List<UserResponse> learners = userService.getLearnersByInstructorId(instructorId);
        return ResponseEntity.ok(learners);
    }

    // Debug endpoints to check database content
    @GetMapping("/debug/all-users")
    public ResponseEntity<List<UserResponse>> getAllUsers() {
        List<UserResponse> users = userService.getAllUsers();
        return ResponseEntity.ok(users);
    }

    @GetMapping("/debug/instructor/{instructorId}/classes")
    public ResponseEntity<String> getInstructorClasses(@PathVariable Long instructorId) {
        String debug = userService.getInstructorDebugInfo(instructorId);
        return ResponseEntity.ok(debug);
    }

    @GetMapping("/debug/enrollments")
    public ResponseEntity<String> getAllEnrollments() {
        String debug = userService.getEnrollmentsDebugInfo();
        return ResponseEntity.ok(debug);
    }

    @GetMapping("/debug/simple")
    public ResponseEntity<String> getSimpleDebug() {
        try {
            String debug = userService.getSimpleDebugInfo();
            return ResponseEntity.ok(debug);
        } catch (Exception e) {
            return ResponseEntity.ok("Error: " + e.getMessage());
        }
    }
}
