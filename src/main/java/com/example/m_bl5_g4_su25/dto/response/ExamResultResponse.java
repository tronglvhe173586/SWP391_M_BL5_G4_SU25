package com.example.m_bl5_g4_su25.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.Instant;
import java.time.LocalDate;
import java.time.LocalTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ExamResultResponse {
    private Long userId;
    private String username;
    private String fullName;
    private String examName;
    private String examType;
    private Integer passScore;
    private Integer maxScore;
    private LocalDate examDate;
    private LocalTime startTime;
    private String location;
    private BigDecimal score;
    private Boolean isPassed;
    private Instant resultDate;
}
