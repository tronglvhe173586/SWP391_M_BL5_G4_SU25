package com.example.m_bl5_g4_su25.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class ExamRegistrationManagementResponse {
    private Long id;
    private String learnerName;
    private String learnerEmail;
    private String examName;
    private String examScheduleName;
    private Instant examDate;
    private String location;
    private Instant registrationDate;
    private String status;
}
