package com.example.m_bl5_g4_su25.dto.response;

import com.example.m_bl5_g4_su25.enums.ExamType;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ExamResponse {
    private Long id;
    private String examName;
    private ExamType examType;
    private Integer passScore;
}
