package com.example.m_bl5_g4_su25.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.ColumnDefault;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;

import java.time.Instant;

@Getter
@Setter
@Entity
<<<<<<< HEAD
@Table(name = "examregistrations")
=======

@Table(name = "examregistrations")

>>>>>>> 6eef93d50ba4d527324154db67ec77c514e53a4b
public class ExamRegistration {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "registration_id", nullable = false)
    private Long id;

    @NotNull
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @OnDelete(action = OnDeleteAction.CASCADE)
    @JoinColumn(name = "learner_id", nullable = false)
    private User learner;

    @NotNull
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @OnDelete(action = OnDeleteAction.CASCADE)
    @JoinColumn(name = "exam_schedule_id", nullable = false)
    private ExamSchedule examSchedule;

    @ColumnDefault("CURRENT_TIMESTAMP")
    @Column(name = "registration_date")
    private Instant registrationDate;

    @ColumnDefault("'PENDING'")
    @Lob
    @Column(name = "status")
    private String status;

}