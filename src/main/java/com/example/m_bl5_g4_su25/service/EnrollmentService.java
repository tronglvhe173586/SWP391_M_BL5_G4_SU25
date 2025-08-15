package com.example.m_bl5_g4_su25.service;

import com.example.m_bl5_g4_su25.dto.request.AddLearnerToClassRequest;
import com.example.m_bl5_g4_su25.entity.Class;
import com.example.m_bl5_g4_su25.entity.Enrollment;
import com.example.m_bl5_g4_su25.entity.User;
import com.example.m_bl5_g4_su25.repository.EnrollmentRepository;
import com.example.m_bl5_g4_su25.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class EnrollmentService {
    
    private final EnrollmentRepository enrollmentRepository;
    private final UserRepository userRepository;
    private final ClassService classService;
    
    @Transactional
    public Enrollment addLearnerToClass(AddLearnerToClassRequest request) {
        // Validate instructor
        User instructor = userRepository.findById(request.getInstructorId())
                .orElseThrow(() -> new RuntimeException("Instructor not found"));
        
        if (!"INSTRUCTOR".equals(instructor.getRole())) {
            throw new RuntimeException("Only instructors can add learners to classes");
        }
        
        // Validate learner
        User learner = userRepository.findById(request.getLearnerId())
                .orElseThrow(() -> new RuntimeException("Learner not found"));
        
        if (!"LEARNER".equals(learner.getRole())) {
            throw new RuntimeException("User to be added must be a learner");
        }
        
        // Validate class and instructor assignment
        Class classEntity = classService.findById(request.getClassId());
        if (classEntity == null) {
            throw new RuntimeException("Class not found");
        }
        
        if (classEntity.getInstructor() == null || 
            !classEntity.getInstructor().getId().equals(request.getInstructorId())) {
            throw new RuntimeException("Instructor is not assigned to this class");
        }
        
        // Check if learner is already enrolled
        Optional<Enrollment> existingEnrollment = enrollmentRepository
                .findByLearnerIdAndClassId(request.getLearnerId(), request.getClassId());
        
        if (existingEnrollment.isPresent()) {
            throw new RuntimeException("Learner is already enrolled in this class");
        }
        
        // Create new enrollment
        Enrollment enrollment = new Enrollment();
        enrollment.setLearner(learner);
        enrollment.setClassField(classEntity);
        enrollment.setEnrollmentDate(Instant.now());
        enrollment.setStatus("ENROLLED");
        
        return enrollmentRepository.save(enrollment);
    }
    
    public boolean isLearnerEnrolledInClass(Long learnerId, Long classId) {
        return enrollmentRepository.findByLearnerIdAndClassId(learnerId, classId).isPresent();
    }
}
