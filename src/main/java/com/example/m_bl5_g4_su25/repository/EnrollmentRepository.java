package com.example.m_bl5_g4_su25.repository;

import com.example.m_bl5_g4_su25.entity.Enrollment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface EnrollmentRepository extends JpaRepository<Enrollment, Long> {
    @Query("SELECT e FROM Enrollment e WHERE e.classField.id = :classId")
    List<Enrollment> findByClassId(Long classId);

    boolean existsByLearnerIdAndClassFieldId(Long learnerId, Long classId);

    List<Enrollment> findByClassFieldId(Long classId);
}
