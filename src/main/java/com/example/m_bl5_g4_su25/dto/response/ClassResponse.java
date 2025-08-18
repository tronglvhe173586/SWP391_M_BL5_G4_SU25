/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.example.m_bl5_g4_su25.dto.response;

import lombok.Data;

import java.time.LocalDate;

@Data
public class ClassResponse {
    private Long classId;
    private Long courseId;
    private String className;
    private LocalDate startDate;
    private LocalDate endDate;
    private Integer maxStudents;
    private Long instructorId;
    private String instructorName;
    private Integer currentStudentsCount;
}
