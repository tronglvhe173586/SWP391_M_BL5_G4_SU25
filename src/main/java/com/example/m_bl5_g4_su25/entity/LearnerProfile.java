package com.example.m_bl5_g4_su25.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.ColumnDefault;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;

import java.time.LocalDate;

@Getter
@Setter
@Entity

@Table(name = "learnerprofiles")

public class LearnerProfile {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "profile_id", nullable = false)
    private Long id;

    @NotNull
    @OneToOne(fetch = FetchType.LAZY, optional = false)
    @OnDelete(action = OnDeleteAction.CASCADE)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(name = "date_of_birth")
    private LocalDate dateOfBirth;

    @Size(max = 20)
    @Column(name = "phone_number", length = 20)
    private String phoneNumber;

    @Size(max = 255)
    @Column(name = "address")
    private String address;

    @Lob
    @Column(name = "license_type")
    private String licenseType;

    @Column(name = "enrollment_date")
    private LocalDate enrollmentDate;

    @ColumnDefault("'PENDING'")
    @Lob
    @Column(name = "progress_status")
    private String progressStatus;

    @Size(max = 255)
    @Column(name = "avatar_url")
    private String avatarUrl;

    @Size(max = 255)
    @Column(name = "cccd_front_image_url")
    private String cccdFrontImageUrl;

    @Size(max = 255)
    @Column(name = "cccd_back_image_url")
    private String cccdBackImageUrl;

}