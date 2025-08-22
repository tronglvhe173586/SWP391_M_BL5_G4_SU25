package com.example.m_bl5_g4_su25.dto.request;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AddEnrollmentRequest {

    @NotNull(message = "Learner ID is required")
    private Long learnerId;

    @NotNull(message = "Class ID is required")
    private Long classId;

}