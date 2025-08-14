package com.example.m_bl5_g4_su25.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.ColumnDefault;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;

import java.time.Instant;
import java.util.LinkedHashSet;
import java.util.Set;

@Getter
@Setter
@Entity
@Table(name = "Enrollments")
public class Enrollment {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "enrollment_id", nullable = false)
    private Long id;

    @NotNull
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @OnDelete(action = OnDeleteAction.CASCADE)
    @JoinColumn(name = "learner_id", nullable = false)
    private User learner;

    @NotNull
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @OnDelete(action = OnDeleteAction.CASCADE)
    @JoinColumn(name = "class_id", nullable = false)
    private Class classField;

    @ColumnDefault("CURRENT_TIMESTAMP")
    @Column(name = "enrollment_date")
    private Instant enrollmentDate;

    @ColumnDefault("'ENROLLED'")
    @Lob
    @Column(name = "status")
    private String status;

    @OneToMany(mappedBy = "enrollment")
    private Set<Attendance> attendances = new LinkedHashSet<>();

}