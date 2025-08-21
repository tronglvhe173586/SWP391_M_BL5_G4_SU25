package com.example.m_bl5_g4_su25.entity;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.util.Date;

@Entity
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
@Table(name = "InvalidatedToken")
public class InvalidatedToken {

    @Id
    @Column(name = "id", nullable = false, unique = true)
    String id;

    @Column(name = "expiry_time", nullable = false)
    Date expiryTime;

}
