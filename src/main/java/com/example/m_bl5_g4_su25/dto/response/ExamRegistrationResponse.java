package com.example.m_bl5_g4_su25.dto.response;

import lombok.Data;
import java.time.Instant;

@Data
public class ExamRegistrationResponse {
    
    private Long id;
    private Long learnerId;
    private String learnerName;
    private String learnerEmail;
    private Long examScheduleId;
    private String examName;
    private String examDate;
    private String startTime;
    private String location;
    private String status;
    private Instant registrationDate;
    private String instructorName;
    private String className;
}
