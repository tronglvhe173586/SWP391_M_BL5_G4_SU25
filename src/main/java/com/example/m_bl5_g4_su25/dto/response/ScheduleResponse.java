package com.example.m_bl5_g4_su25.dto.response;

import java.time.LocalDate;
import java.time.LocalTime;

public record ScheduleResponse(Long id,
                               String dayOfWeek,
                               LocalDate date,
                               LocalTime startTime,
                               LocalTime endTime,
                               String topic,
                               Long classId) {
}
