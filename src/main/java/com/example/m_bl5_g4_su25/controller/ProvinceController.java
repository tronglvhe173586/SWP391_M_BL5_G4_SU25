package com.example.m_bl5_g4_su25.controller;

import com.example.m_bl5_g4_su25.dto.response.ProvinceResponse;
import com.example.m_bl5_g4_su25.entity.Provinces;
import com.example.m_bl5_g4_su25.service.ProvinceService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/provinces")
@RequiredArgsConstructor
public class ProvinceController {
    private final ProvinceService provinceService;

    @GetMapping
    public ResponseEntity<List<ProvinceResponse>> getAllProvinces() {
        return ResponseEntity.ok(provinceService.getAllProvinces());
    }
}