package com.example.m_bl5_g4_su25.configuration;

import com.example.m_bl5_g4_su25.dto.request.IntrospectRequest;
import com.example.m_bl5_g4_su25.service.AuthenticationService;
import com.example.m_bl5_g4_su25.service.IAuthenticationService;
import com.nimbusds.jose.JOSEException;
import lombok.experimental.NonFinal;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.oauth2.jose.jws.MacAlgorithm;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.security.oauth2.jwt.JwtDecoder;
import org.springframework.security.oauth2.jwt.JwtException;
import org.springframework.security.oauth2.jwt.NimbusJwtDecoder;
import org.springframework.stereotype.Component;

import javax.crypto.spec.SecretKeySpec;
import java.text.ParseException;
import java.util.Base64;
import java.util.Objects;

@Component
public class CustomJwtDecoder implements JwtDecoder {
    @NonFinal
    @Value("${jwt.signerKey}")
    private String signerKey;

    private NimbusJwtDecoder nimbusJwtDecoder = null;

    @Override
    public Jwt decode(String token) throws JwtException {

        if (Objects.isNull(nimbusJwtDecoder)) {
            byte[] keyBytes = Base64.getDecoder().decode(signerKey);
            SecretKeySpec secretKeySpec = new SecretKeySpec(keyBytes, "HS256");
            nimbusJwtDecoder = NimbusJwtDecoder.withSecretKey(secretKeySpec)
                    .macAlgorithm(MacAlgorithm.HS256)
                    .build();
        }

        return nimbusJwtDecoder.decode(token);
    }
}
