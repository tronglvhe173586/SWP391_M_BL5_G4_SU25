package com.example.m_bl5_g4_su25.entity;


import jakarta.persistence.*;
import lombok.*;

import java.util.Date;
@Entity
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
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
