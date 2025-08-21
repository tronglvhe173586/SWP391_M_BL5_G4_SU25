package com.example.m_bl5_g4_su25.dto.request;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.time.LocalDate;
import java.time.LocalTime;

@Data
public class ExamScheduleUpdateRequest {
    @NotNull
    private LocalDate examDate;

    @NotNull
    private LocalTime startTime;

    private String location;

    private Integer maxParticipants;
}
