package com.example.m_bl5_g4_su25.dto.request;

import jakarta.validation.constraints.Size;
import lombok.Data;

import java.time.LocalDate;

@Data
public class EditClassRequest {
    Long courseId;

    @Size(max = 100)
    String className;

    LocalDate startDate;

    LocalDate endDate;

    Integer maxStudents;

    Long instructorId;
}