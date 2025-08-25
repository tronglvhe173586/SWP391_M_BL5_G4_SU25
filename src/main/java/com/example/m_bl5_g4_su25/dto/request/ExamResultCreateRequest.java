package com.example.m_bl5_g4_su25.dto.request;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.DecimalMax;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ExamResultCreateRequest {

    @NotNull(message = "Learner ID is required")
    private Long learnerId;

    @NotNull(message = "Exam Schedule ID is required")
    private Long examScheduleId;

    @NotNull(message = "Score is required")
    @DecimalMin(value = "0.0", message = "Score must be at least 0.0")
    @DecimalMax(value = "100.0", message = "Score cannot exceed 100.0")
    private BigDecimal score;
}
