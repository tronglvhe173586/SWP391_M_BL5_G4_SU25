package com.example.m_bl5_g4_su25.repository;

import com.example.m_bl5_g4_su25.entity.DrivingClass;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ClassRepository extends JpaRepository<DrivingClass, Long> {
    boolean existsByClassName(String className);
}