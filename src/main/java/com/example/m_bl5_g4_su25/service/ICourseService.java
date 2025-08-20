package com.example.m_bl5_g4_su25.service;

import com.example.m_bl5_g4_su25.dto.request.AddCourseRequest;
import com.example.m_bl5_g4_su25.dto.request.EditCourseRequest;
import com.example.m_bl5_g4_su25.dto.response.ListCourseResponse;
import org.springframework.data.domain.Page;

public interface ICourseService {
    Page<ListCourseResponse> getAllCoursesPagination(String keyword, int page, int size);
    ListCourseResponse editCourse(Long id, EditCourseRequest request);
    ListCourseResponse addCourse(AddCourseRequest request);



}
