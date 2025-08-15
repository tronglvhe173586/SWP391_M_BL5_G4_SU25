package com.example.m_bl5_g4_su25.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.*;
import org.hibernate.annotations.ColumnDefault;

import java.time.Instant;
import java.util.LinkedHashSet;
import java.util.Set;

@Getter
@Setter
@Entity
@Table(name = "Users")
@Builder
@NoArgsConstructor
@AllArgsConstructor

public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "user_id", nullable = false)
    private Long id;

    @Size(max = 255)
    @NotNull
    @Column(name = "username", nullable = false)
    private String username;

    @Size(max = 255)
    @NotNull
    @Column(name = "password_hash", nullable = false)
    private String passwordHash;

    @Size(max = 255)
    @NotNull
    @Column(name = "email", nullable = false)
    private String email;

    @Size(max = 255)
    @NotNull
    @Column(name = "full_name", nullable = false)
    private String fullName;

    @NotNull
    @Lob
    @Column(name = "role", nullable = false)
    private String role;

    @ColumnDefault("1")
    @Column(name = "is_active")
    private Boolean isActive;

    @ColumnDefault("CURRENT_TIMESTAMP")
    @Column(name = "created_at")
    private Instant createdAt;

    @ColumnDefault("CURRENT_TIMESTAMP")
    @Column(name = "updated_at")
    private Instant updatedAt;

    @OneToMany(mappedBy = "instructor")
    private Set<Class> classes = new LinkedHashSet<>();

    @OneToMany(mappedBy = "learner")
    private Set<Enrollment> enrollments = new LinkedHashSet<>();

    @OneToMany(mappedBy = "learner")
    private Set<ExamRegistration> examRegistrations = new LinkedHashSet<>();

    @OneToMany(mappedBy = "learner")
    private Set<ExamResult> examResults = new LinkedHashSet<>();

    @OneToMany(mappedBy = "instructor")
    private Set<ExamSchedule> examSchedules = new LinkedHashSet<>();

    @OneToOne(mappedBy = "user")
    private InstructorProfile instructorProfile;

    @OneToOne(mappedBy = "user")
    private LearnerProfile learnerProfile;

}