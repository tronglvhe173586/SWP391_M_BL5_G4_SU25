package com.example.m_bl5_g4_su25.repository;

import com.example.m_bl5_g4_su25.entity.ExamRegistration;
import com.example.m_bl5_g4_su25.entity.ExamSchedule;
import com.example.m_bl5_g4_su25.enums.RegistrationStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ExamRegistrationRepository extends JpaRepository<ExamRegistration, Long> {
    long countByExamSchedule_Id(Long examScheduleId);

    Optional<ExamRegistration> findByExamSchedule_IdAndLearner_Id(Long examScheduleId, Long learnerId);

    List<ExamRegistration> findByLearner_IdAndExamSchedule_IdIn(Long learnerId, List<Long> examScheduleIds);

//    List<ExamRegistration> findByLearnerIdAndStatus(Long learnerId, String status);

}