package com.example.m_bl5_g4_su25.repository;

import com.example.m_bl5_g4_su25.entity.Enrollment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface EnrollmentRepository extends JpaRepository<Enrollment, Long> {
    List<Enrollment> findByClassFieldId(Long classId);
}
