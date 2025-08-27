package com.example.m_bl5_g4_su25.repository;

import com.example.m_bl5_g4_su25.entity.ExamSchedule;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ExamScheduleRepository extends JpaRepository<ExamSchedule, Long> {
    @Query("SELECT es FROM ExamSchedule es JOIN es.classField c JOIN c.enrollments e WHERE e.learner.id = :learnerId")
    List<ExamSchedule> findByClassFieldLearnersId(@Param("learnerId") Long learnerId, String confirmed);
    @Query("SELECT s FROM ExamSchedule s " +
            "JOIN ExamRegistration r ON s.id = r.examSchedule.id " +
            "WHERE r.learner.id = :learnerId AND r.status = :status")
    List<ExamSchedule> findSchedulesByLearnerIdAndConfirmed(
            @Param("learnerId") Long learnerId,
            @Param("status") String status);
}
