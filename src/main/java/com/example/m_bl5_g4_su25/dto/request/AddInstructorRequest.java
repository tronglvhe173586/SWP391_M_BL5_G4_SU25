package com.example.m_bl5_g4_su25.dto.request;

import lombok.Data;

import java.time.LocalDate;

@Data
public class AddInstructorRequest {
    private String username;
    private String passwordHash;
    private String email;
    private String fullName;
    private Boolean isActive;

    private String employeeId;
    private LocalDate hireDate;
    private String certificationInfo;

}