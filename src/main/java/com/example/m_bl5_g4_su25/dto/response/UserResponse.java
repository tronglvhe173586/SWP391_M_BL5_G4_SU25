package com.example.m_bl5_g4_su25.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserResponse {
    private Long id;
    private String username;
    private String email;
    private String fullName;
    private String role;
    private Boolean isActive;

    // Learner profile fields
    private LocalDate dateOfBirth;
    private String phoneNumber;
    private String address;
    private String licenseType;
    private LocalDate enrollmentDate;
    private String progressStatus;
    private String avatarUrl;
}
