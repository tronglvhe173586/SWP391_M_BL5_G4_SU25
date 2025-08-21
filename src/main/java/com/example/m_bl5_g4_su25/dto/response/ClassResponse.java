package com.example.m_bl5_g4_su25.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ClassResponse {
    private Long id;
    private String className;
    private LocalDate startDate;
    private LocalDate endDate;
    private Integer maxStudents;
    private Long courseId;
    private Long instructorId;
    private String instructorName;
    private Integer currentStudentsCount;
}