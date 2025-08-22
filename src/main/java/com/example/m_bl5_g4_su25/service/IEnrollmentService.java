package com.example.m_bl5_g4_su25.service;

import com.example.m_bl5_g4_su25.dto.request.AddEnrollmentRequest;
import com.example.m_bl5_g4_su25.dto.request.EditEnrollmentRequest;
import com.example.m_bl5_g4_su25.dto.response.EnrollmentResponse;

import java.util.List;

public interface IEnrollmentService {
    List<EnrollmentResponse> listLearnersInClass(Long classId);
    EnrollmentResponse addEnrollment(AddEnrollmentRequest request);
    EnrollmentResponse getEnrollmentById(Long enrollmentId);
    EnrollmentResponse updateEnrollment(Long enrollmentId, EditEnrollmentRequest request);
}