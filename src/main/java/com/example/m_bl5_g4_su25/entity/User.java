package com.example.m_bl5_g4_su25.entity;

import com.example.m_bl5_g4_su25.enums.Gender;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.*;
import org.hibernate.annotations.ColumnDefault;

import java.time.Instant;
import java.time.LocalDate;
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
    @Column(name = "username", nullable = false, unique = true)
    private String username;

    @Size(max = 255)
    @NotNull
    @Column(name = "password_hash", nullable = false)
    private String passwordHash;

    @Size(max = 255)
    @NotBlank
    @Column(name = "email", nullable = false, unique = true)
    private String email;

    @Size(max = 255)
    @NotBlank
    @Column(name = "first_name", nullable = false)
    private String firstName;

    @Size(max = 255)
    @NotBlank
    @Column(name = "last_name", nullable = false)
    private String lastName;

    @Enumerated(EnumType.STRING)
    @Column(name = "gender", nullable = false)
    private Gender gender;

    @Column(name = "date_of_birth")
    private LocalDate dateOfBirth;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "province_id")
    private Provinces province;

    @NotNull
    @Lob
    @Column(name = "role", nullable = false)
    private String role;

    @ColumnDefault("1")
    @Column(name = "is_active")
    private Boolean isActive = true;

    @ColumnDefault("CURRENT_TIMESTAMP")
    @Column(name = "created_at", updatable = false, insertable = false)
    private Instant createdAt;

    @ColumnDefault("CURRENT_TIMESTAMP")
    @Column(name = "updated_at", insertable = false)
    private Instant updatedAt;

    // Quan hệ với các bảng khác
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

    @OneToOne(mappedBy = "user", cascade = CascadeType.ALL)
    private ForgotPassword forgotPassword;
}