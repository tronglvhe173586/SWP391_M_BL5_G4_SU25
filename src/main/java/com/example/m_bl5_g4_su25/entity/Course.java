package com.example.m_bl5_g4_su25.entity;

import jakarta.persistence.*;
import lombok.Data;
import com.example.m_bl5_g4_su25.enums.CourseType;
import java.math.BigDecimal;

@Entity
@Table(name = "Courses")
@Data
public class Course {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "course_id")
    private Long id;

    @Column(name = "course_name", unique = true, nullable = false)
    private String courseName;

    @Column(name = "course_type")
    @Enumerated(EnumType.STRING)
    private CourseType courseType;

    @Column(name = "description")
    private String description;

    @Column(name = "price", nullable = false)
    private BigDecimal price;

    @Column(name = "duration", nullable = false)
    private Integer duration;

    @Column(name = "is_deleted")
    private Boolean isDeleted = false;
}