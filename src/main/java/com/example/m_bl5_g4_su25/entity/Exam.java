package com.example.m_bl5_g4_su25.entity;


import com.example.m_bl5_g4_su25.enums.ExamType;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

import java.util.LinkedHashSet;
import java.util.Set;

@Getter
@Setter
@Entity
<<<<<<< HEAD
@Table(name = "exams")
=======

@Table(name = "exams")

>>>>>>> 6eef93d50ba4d527324154db67ec77c514e53a4b
public class Exam {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "exam_id", nullable = false)
    private Long id;

    @Size(max = 100)
    @NotNull
    @Column(name = "exam_name", nullable = false, length = 100)
    private String examName;

    @NotNull

    @Enumerated(EnumType.STRING)
    @Column(name = "exam_type", nullable = false)
    private ExamType examType;


    @NotNull
    @Column(name = "pass_score", nullable = false)
    private Integer passScore;

    @OneToMany(mappedBy = "exam")
    private Set<ExamSchedule> examSchedules = new LinkedHashSet<>();

}