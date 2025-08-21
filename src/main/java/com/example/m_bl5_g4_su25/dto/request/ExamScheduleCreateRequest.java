package com.example.m_bl5_g4_su25.dto.request;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import jakarta.validation.constraints.Min;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ExamScheduleCreateRequest {

    @NotNull(message = "Exam ID is required")
    private Long examId;

    private Long classId; // Optional

    private Long instructorId; // Optional

    @NotNull(message = "Exam date is required")
    private LocalDate examDate;

    @NotNull(message = "Start time is required")
    private LocalTime startTime;

    @Size(max = 255, message = "Location must not exceed 255 characters")
    private String location;

    @Min(value = 1, message = "Max participants must be at least 1")
    private Integer maxParticipants;
}

