package com.example.m_bl5_g4_su25.dto.request;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class UpdateExamRegistrationStatusRequest {
    private String status;
}
