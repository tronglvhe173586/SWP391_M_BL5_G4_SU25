package com.example.m_bl5_g4_su25.dto.request;

import com.example.m_bl5_g4_su25.enums.CourseType;
import lombok.Data;

import java.math.BigDecimal;

@Data
public class AddCourseRequest {
    private String courseName;
    private CourseType courseType;
    private String description;
    private BigDecimal price;
    private Integer duration;
    private Boolean isDeleted;
}