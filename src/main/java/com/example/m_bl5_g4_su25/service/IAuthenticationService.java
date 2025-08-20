package com.example.m_bl5_g4_su25.service;

import com.example.m_bl5_g4_su25.dto.request.AuthenticationRequest;
import com.example.m_bl5_g4_su25.dto.request.IntrospectRequest;
import com.example.m_bl5_g4_su25.dto.response.AuthenticationResponse;
import com.example.m_bl5_g4_su25.dto.response.IntrospectResponse;
import com.nimbusds.jose.JOSEException;

import java.text.ParseException;

public interface IAuthenticationService {
    AuthenticationResponse authenticate(AuthenticationRequest request) throws ParseException, JOSEException;
    AuthenticationResponse outboundAuthenticate(String code);
}
