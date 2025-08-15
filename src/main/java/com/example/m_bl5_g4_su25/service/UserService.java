package com.example.m_bl5_g4_su25.service;

import com.example.m_bl5_g4_su25.dto.response.UserResponse;
import com.example.m_bl5_g4_su25.entity.User;
import com.example.m_bl5_g4_su25.entity.Enrollment;
import com.example.m_bl5_g4_su25.repository.UserRepository;
import com.example.m_bl5_g4_su25.repository.EnrollmentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final EnrollmentRepository enrollmentRepository;

    public List<UserResponse> getLearnersByInstructorId(Long instructorId) {
        List<User> learners = userRepository.findLearnersByInstructorId(instructorId);
        return learners.stream()
                .map(this::convertToUserResponse)
                .collect(Collectors.toList());
    }

    // Debug method to get all users
    public List<UserResponse> getAllUsers() {
        List<User> users = userRepository.findAll();
        return users.stream()
                .map(this::convertToUserResponse)
                .collect(Collectors.toList());
    }

    // Debug method to check instructor classes and enrollments
    public String getInstructorDebugInfo(Long instructorId) {
        StringBuilder debug = new StringBuilder();

        // Check if instructor exists
        User instructor = userRepository.findById(instructorId).orElse(null);
        if (instructor == null) {
            return "Instructor with ID " + instructorId + " not found";
        }

        debug.append("Instructor: ").append(instructor.getFullName())
             .append(" (Role: ").append(instructor.getRole()).append(")\n");

        // Check classes taught by this instructor
        debug.append("Classes taught: ").append(instructor.getClasses().size()).append("\n");
        instructor.getClasses().forEach(cls -> {
            debug.append("- Class: ").append(cls.getClassName())
                 .append(" (ID: ").append(cls.getId()).append(")")
                 .append(" Enrollments: ").append(cls.getEnrollments().size()).append("\n");

            cls.getEnrollments().forEach(enrollment -> {
                debug.append("  - Learner: ").append(enrollment.getLearner().getFullName())
                     .append(" (Role: ").append(enrollment.getLearner().getRole()).append(")")
                     .append(" Status: ").append(enrollment.getStatus()).append("\n");
            });
        });

        return debug.toString();
    }

    // Debug method to check all enrollments
    public String getEnrollmentsDebugInfo() {
        StringBuilder debug = new StringBuilder();

        List<Enrollment> enrollments = enrollmentRepository.findAll();
        debug.append("Total enrollments: ").append(enrollments.size()).append("\n\n");

        enrollments.forEach(enrollment -> {
            debug.append("Enrollment ID: ").append(enrollment.getId()).append("\n");
            debug.append("- Learner: ").append(enrollment.getLearner().getFullName())
                 .append(" (ID: ").append(enrollment.getLearner().getId()).append(")")
                 .append(" (Role: ").append(enrollment.getLearner().getRole()).append(")\n");
            debug.append("- Class: ").append(enrollment.getClassField().getClassName())
                 .append(" (ID: ").append(enrollment.getClassField().getId()).append(")\n");
            if (enrollment.getClassField().getInstructor() != null) {
                debug.append("- Instructor: ").append(enrollment.getClassField().getInstructor().getFullName())
                     .append(" (ID: ").append(enrollment.getClassField().getInstructor().getId()).append(")\n");
            }
            debug.append("- Status: ").append(enrollment.getStatus()).append("\n");
            debug.append("- Enrollment Date: ").append(enrollment.getEnrollmentDate()).append("\n\n");
        });

        return debug.toString();
    }

    // Simple debug method that doesn't use lazy loading
    public String getSimpleDebugInfo() {
        StringBuilder debug = new StringBuilder();

        try {
            // Count users
            long userCount = userRepository.count();
            debug.append("Total users: ").append(userCount).append("\n");

            // Count enrollments
            long enrollmentCount = enrollmentRepository.count();
            debug.append("Total enrollments: ").append(enrollmentCount).append("\n");

            // Get first few users without lazy loading
            List<User> users = userRepository.findAll();
            debug.append("\nFirst few users:\n");
            users.stream().limit(5).forEach(user -> {
                debug.append("- ID: ").append(user.getId())
                     .append(", Name: ").append(user.getFullName())
                     .append(", Role: ").append(user.getRole()).append("\n");
            });

        } catch (Exception e) {
            debug.append("Error: ").append(e.getMessage());
        }

        return debug.toString();
    }

    private UserResponse convertToUserResponse(User user) {
        UserResponse response = new UserResponse();
        response.setId(user.getId());
        response.setUsername(user.getUsername());
        response.setEmail(user.getEmail());
        response.setFullName(user.getFullName());
        response.setRole(user.getRole());
        response.setIsActive(user.getIsActive());

        // Add learner profile information if available (handle missing table gracefully)
        try {
            if (user.getLearnerProfile() != null) {
                response.setDateOfBirth(user.getLearnerProfile().getDateOfBirth());
                response.setPhoneNumber(user.getLearnerProfile().getPhoneNumber());
                response.setAddress(user.getLearnerProfile().getAddress());
                response.setLicenseType(user.getLearnerProfile().getLicenseType());
                response.setEnrollmentDate(user.getLearnerProfile().getEnrollmentDate());
                response.setProgressStatus(user.getLearnerProfile().getProgressStatus());
                response.setAvatarUrl(user.getLearnerProfile().getAvatarUrl());
            }
        } catch (Exception e) {
            // LearnerProfile table might not exist, skip it
            System.out.println("Warning: Could not load learner profile for user " + user.getId() + ": " + e.getMessage());
        }

        return response;
    }
}
