package com.example.m_bl5_g4_su25.entity;


import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.Date;
@Entity
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Builder
@Table(name = "ForgotPassword")
public class ForgotPassword {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "fid", nullable = false)
    private Integer fid;

    @Column(name = "otp", nullable = false)
    private Integer otp;

    @Column(name = "expiration_time", nullable = false)
    private Date expirationTime;

    @OneToOne
    @JoinColumn(name = "user_id")
    private User user;

}
