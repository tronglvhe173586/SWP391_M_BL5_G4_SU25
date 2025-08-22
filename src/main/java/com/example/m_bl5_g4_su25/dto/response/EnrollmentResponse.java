package com.example.m_bl5_g4_su25.dto.response;

import com.example.m_bl5_g4_su25.entity.Enrollment;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class EnrollmentResponse {
    private Long id;
    private Long learnerId;
    private String learnerName;
    private Long classId;
    private String className;
    private LocalDateTime enrollmentDate;
    private Enrollment.Status status;
}