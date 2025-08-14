package com.example.m_bl5_g4_su25.entity;

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
@Table(name = "Exams")
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
    @Lob
    @Column(name = "exam_type", nullable = false)
    private String examType;

    @NotNull
    @Column(name = "pass_score", nullable = false)
    private Integer passScore;

    @OneToMany(mappedBy = "exam")
    private Set<ExamSchedule> examSchedules = new LinkedHashSet<>();

}