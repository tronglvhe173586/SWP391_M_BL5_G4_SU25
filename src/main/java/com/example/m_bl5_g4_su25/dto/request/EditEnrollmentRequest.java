package com.example.m_bl5_g4_su25.dto.request;

import com.example.m_bl5_g4_su25.entity.Enrollment;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class EditEnrollmentRequest {

    private Enrollment.Status status;  // Only allow updating status
}