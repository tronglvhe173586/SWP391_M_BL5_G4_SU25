package com.example.m_bl5_g4_su25.repository;

import com.example.m_bl5_g4_su25.entity.ExamResult;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ExamResultRepository extends JpaRepository<ExamResult, Long> {
    List<ExamResult> findByLearnerIdAndExamScheduleId(Long learnerId, Long examScheduleId);

    List<ExamResult> findByExamScheduleId(Long examScheduleId);
}
