package com.example.m_bl5_g4_su25.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.Instant;
import java.time.LocalDate;
import java.time.LocalTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ExamResultResponse {
    private Long id;
    private Long learnerId;
    private String learnerName;
    private String learnerEmail;
    private Long examScheduleId;
    private String examName;
    private String examType;
    private String className;
    private LocalDate examDate;
    private LocalTime startTime;
    private String location;
    private String instructorName;
    private BigDecimal score;
    private Boolean isPassed;
    private Instant resultDate;
    private Integer passScore;
}
