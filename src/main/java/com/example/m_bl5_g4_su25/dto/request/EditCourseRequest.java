package com.example.m_bl5_g4_su25.dto.request;

import com.example.m_bl5_g4_su25.enums.CourseType;
import jakarta.persistence.Column;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

import java.math.BigDecimal;

@Data
public class EditCourseRequest {

    private String courseName;
    private CourseType courseType;
    private String description;
    private BigDecimal price;
    private Integer duration;
    private Boolean isDeleted;
}
