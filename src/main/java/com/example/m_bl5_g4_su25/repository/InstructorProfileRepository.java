package com.example.m_bl5_g4_su25.repository;

import com.example.m_bl5_g4_su25.entity.InstructorProfile;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface InstructorProfileRepository extends JpaRepository<InstructorProfile,Long> {
}
