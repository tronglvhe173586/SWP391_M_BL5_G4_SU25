package com.example.m_bl5_g4_su25.service;

import com.example.m_bl5_g4_su25.dto.request.AddEnrollmentRequest;
import com.example.m_bl5_g4_su25.dto.request.EditEnrollmentRequest;
import com.example.m_bl5_g4_su25.dto.response.EnrollmentResponse;
import com.example.m_bl5_g4_su25.entity.DrivingClass;
import com.example.m_bl5_g4_su25.entity.Enrollment;
import com.example.m_bl5_g4_su25.entity.User;
import com.example.m_bl5_g4_su25.exception.EnrollmentNotFoundException;
import com.example.m_bl5_g4_su25.exception.EnrollmentValidationException;
import com.example.m_bl5_g4_su25.repository.ClassRepository;
import com.example.m_bl5_g4_su25.repository.EnrollmentRepository;
import com.example.m_bl5_g4_su25.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class EnrollmentService implements IEnrollmentService {

    @Autowired
    private EnrollmentRepository enrollmentRepository;

    @Autowired
    private ClassRepository classRepository;

    @Autowired
    private UserRepository userRepository;

    @Override
    public List<EnrollmentResponse> listLearnersInClass(Long classId) {
        List<Enrollment> enrollments = enrollmentRepository.findByClassId(classId);
        return enrollments.stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    @Override
    public EnrollmentResponse addEnrollment(AddEnrollmentRequest request) {
        validateEnrollmentRequest(request);

        DrivingClass classEntity = classRepository.findById(request.getClassId())
                .orElseThrow(() -> new EnrollmentValidationException("Lớp học với ID " + request.getClassId() + " không tồn tại"));
        User learner = userRepository.findById(request.getLearnerId())
                .orElseThrow(() -> new EnrollmentValidationException("Học viên với ID " + request.getLearnerId() + " không tồn tại"));

        Enrollment enrollment = new Enrollment();
        enrollment.setClassField(classEntity);
        enrollment.setLearner(learner);
        Enrollment savedEnrollment = enrollmentRepository.save(enrollment);
        return convertToResponse(savedEnrollment);
    }

    @Override
    public EnrollmentResponse getEnrollmentById(Long enrollmentId) {
        Optional<Enrollment> enrollmentOptional = enrollmentRepository.findById(enrollmentId);
        if (enrollmentOptional.isPresent()) {
            return convertToResponse(enrollmentOptional.get());
        } else {
            throw new EnrollmentNotFoundException(enrollmentId);
        }
    }

    @Override
    public EnrollmentResponse updateEnrollment(Long enrollmentId, EditEnrollmentRequest request) {
        Optional<Enrollment> enrollmentOptional = enrollmentRepository.findById(enrollmentId);

        if (enrollmentOptional.isPresent()) {
            Enrollment enrollment = enrollmentOptional.get();
            if (request.getStatus() != null) {
                enrollment.setStatus(request.getStatus());
            }

            Enrollment updatedEnrollment = enrollmentRepository.save(enrollment);
            return convertToResponse(updatedEnrollment);
        } else {
            throw new EnrollmentNotFoundException(enrollmentId);
        }
    }

    private EnrollmentResponse convertToResponse(Enrollment enrollment) {
        return new EnrollmentResponse(
                enrollment.getId(),
                enrollment.getLearner().getId(),
                enrollment.getLearner().getFirstName() + " " + enrollment.getLearner().getLastName(),
                enrollment.getClassField().getId(),
                enrollment.getClassField().getClassName(),
                enrollment.getEnrollmentDate(),
                enrollment.getStatus()
        );
    }

    private void validateEnrollmentRequest(AddEnrollmentRequest request) {
        if (enrollmentRepository.existsByLearnerIdAndClassFieldId(request.getLearnerId(), request.getClassId())) {
            throw new EnrollmentValidationException("Học viên đã đăng ký vào lớp học này");
        }
    }
}