package com.example.m_bl5_g4_su25.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.util.LinkedHashSet;
import java.util.Set;
//cuong has commit here
@Getter
@Setter
@Entity

@Table(name = "Courses")

public class Course {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "course_id", nullable = false)
    private Long id;

    @Size(max = 50)
    @NotNull
    @Column(name = "course_name", nullable = false, length = 50)
    private String courseName;

    @Lob
    @Column(name = "description")
    private String description;

    @NotNull
    @Column(name = "price", nullable = false, precision = 10, scale = 2)
    private BigDecimal price;

    @NotNull
    @Column(name = "duration", nullable = false)
    private Integer duration;

    @OneToMany(mappedBy = "course")
    private Set<Class> classes = new LinkedHashSet<>();

}