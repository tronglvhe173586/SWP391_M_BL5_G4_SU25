package com.example.m_bl5_g4_su25.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class LearnerExamScheduleResponse {
    private Long id;
    private String examName;
    private String examType;
    private String className;
    private LocalDate examDate;
    private LocalTime startTime;
    private String location;
    private String instructorName;
    private String registrationStatus;
    private String examResult;
}
