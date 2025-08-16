package com.example.m_bl5_g4_su25.dto.request;

import com.example.m_bl5_g4_su25.enums.ExamType;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.Max;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ExamCreateRequest {

    @Size(max = 100, message = "Exam name must not exceed 100 characters")
    @NotNull(message = "Exam name is required")
    private String examName;

    @NotNull(message = "Exam type is required")
    private ExamType examType;

    @NotNull(message = "Pass score is required")
    @Min(value = 0, message = "Pass score must be at least 0")
    @Max(value = 100, message = "Pass score must not exceed 100")
    private Integer passScore;
}
