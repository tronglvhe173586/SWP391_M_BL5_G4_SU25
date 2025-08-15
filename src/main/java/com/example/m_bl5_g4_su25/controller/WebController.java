package com.example.m_bl5_g4_su25.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class WebController {
    
    @GetMapping("/learners")
    public String listLearners() {
        return "list-learners.html";
    }
}
