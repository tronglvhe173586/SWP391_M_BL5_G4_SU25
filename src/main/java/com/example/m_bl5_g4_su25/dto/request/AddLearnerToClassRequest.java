package com.example.m_bl5_g4_su25.dto.request;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import jakarta.validation.constraints.NotNull;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AddLearnerToClassRequest {
    
    @NotNull(message = "Instructor ID is required")
    private Long instructorId;
    
    @NotNull(message = "Learner ID is required")
    private Long learnerId;
    
    @NotNull(message = "Class ID is required")
    private Long classId;
}
