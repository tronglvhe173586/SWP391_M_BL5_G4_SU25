package com.example.m_bl5_g4_su25.service;

import com.example.m_bl5_g4_su25.dto.request.AddClassRequest;
import com.example.m_bl5_g4_su25.dto.request.EditClassRequest;
import com.example.m_bl5_g4_su25.dto.response.ClassResponse;

import java.util.List;

public interface IClassService {
    public List<ClassResponse> getAllClasses();

    public ClassResponse getClassById(Long classId);

    public ClassResponse createClass(AddClassRequest request);

    public ClassResponse updateClass(Long classId, EditClassRequest request);
}