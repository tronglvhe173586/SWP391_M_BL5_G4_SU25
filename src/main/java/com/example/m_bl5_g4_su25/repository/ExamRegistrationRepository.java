package com.example.m_bl5_g4_su25.repository;

import com.example.m_bl5_g4_su25.entity.ExamRegistration;
import com.example.m_bl5_g4_su25.entity.ExamSchedule;
import com.example.m_bl5_g4_su25.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ExamRegistrationRepository extends JpaRepository<ExamRegistration, Long> {
    long countByExamSchedule_Id(Long examScheduleId);

    Optional<ExamRegistration> findByExamSchedule_IdAndLearner_Id(Long examScheduleId, Long learnerId);

    List<ExamRegistration> findByLearner_IdAndExamSchedule_IdIn(Long learnerId, List<Long> examScheduleIds);

    boolean existsByLearnerAndExamSchedule(User learner, ExamSchedule examSchedule);

    List<ExamRegistration> findByLearner_IdInAndExamSchedule_IdIn(List<Long> learnerIds, List<Long> examScheduleIds);

    List<ExamRegistration> findByLearner_IdInAndExamSchedule_Id(List<Long> learnerIds, Long examScheduleId);

}