package com.example.m_bl5_g4_su25.service;

import com.example.m_bl5_g4_su25.dto.response.ProvinceResponse;
import com.example.m_bl5_g4_su25.entity.Provinces;
import com.example.m_bl5_g4_su25.repository.ProvinceRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ProvinceService {
    private final ProvinceRepository provinceRepository;

    public List<ProvinceResponse> getAllProvinces() {
        return provinceRepository.findAll()
                .stream()
                .map(p -> new ProvinceResponse(p.getId(), p.getName()))
                .toList();
    }
}