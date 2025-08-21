package com.example.m_bl5_g4_su25.dto.response;

import com.example.m_bl5_g4_su25.enums.CourseType;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import java.math.BigDecimal;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor


public class ListCourseResponse {
    private Long id;
    private String courseName;
    private CourseType courseType;
    private String description;
    private BigDecimal price;
    private Integer duration;
    private Boolean isDeleted;
}
