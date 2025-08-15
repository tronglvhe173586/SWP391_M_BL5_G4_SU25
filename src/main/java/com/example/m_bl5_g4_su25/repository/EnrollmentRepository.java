package com.example.m_bl5_g4_su25.repository;

import com.example.m_bl5_g4_su25.entity.Enrollment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface EnrollmentRepository extends JpaRepository<Enrollment, Long> {

    @Query("SELECT e FROM Enrollment e WHERE e.learner.id = :learnerId AND e.classField.id = :classId")
    Optional<Enrollment> findByLearnerIdAndClassId(@Param("learnerId") Long learnerId, @Param("classId") Long classId);
}
