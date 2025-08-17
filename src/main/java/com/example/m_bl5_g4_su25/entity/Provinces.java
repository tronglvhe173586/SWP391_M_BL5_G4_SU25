package com.example.m_bl5_g4_su25.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;

import java.util.LinkedHashSet;
import java.util.Set;

@Entity
@Table(name = "Provinces")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Provinces {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "province_id")
    private Long id;

    @Column(name = "province_name", nullable = false, unique = true)
    private String name;

    @OneToMany(mappedBy = "province")
    @JsonIgnore

    private Set<User> users = new LinkedHashSet<>();
}
