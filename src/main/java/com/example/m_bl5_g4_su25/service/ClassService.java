package com.example.m_bl5_g4_su25.service;

import com.example.m_bl5_g4_su25.entity.Class;
import com.example.m_bl5_g4_su25.repository.ClassRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class ClassService {
    
    private final ClassRepository classRepository;
    
    public Class findById(Long classId) {
        return classRepository.findById(classId).orElse(null);
    }
}
