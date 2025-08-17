/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.example.m_bl5_g4_su25.service;

import com.example.m_bl5_g4_su25.dto.request.AddClassRequest;
import com.example.m_bl5_g4_su25.dto.request.EditClassRequest;
import com.example.m_bl5_g4_su25.dto.response.ClassResponse;

import java.util.List;

public interface IClassService {
    List<ClassResponse> listClasses(Long instructorId);
    ClassResponse addClass(AddClassRequest request);
    ClassResponse getClassById(Long id);
    ClassResponse editClass(Long id, EditClassRequest request);
}