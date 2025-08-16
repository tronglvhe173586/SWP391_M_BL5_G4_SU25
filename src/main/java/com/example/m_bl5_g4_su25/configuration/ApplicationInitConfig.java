package com.example.m_bl5_g4_su25.configuration;

import com.example.m_bl5_g4_su25.entity.User;
import com.example.m_bl5_g4_su25.repository.UserRepository;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.ApplicationRunner;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.HashSet;

@Configuration
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Slf4j
public class ApplicationInitConfig {

    PasswordEncoder passwordEncoder;

    @Bean
    @ConditionalOnProperty(
            prefix = "spring",
            value = "datasource.driverClassName",
            havingValue = "com.mysql.cj.jdbc.Driver")
    ApplicationRunner applicationRunner(UserRepository userRepository) {
        return args -> {
            if (userRepository.findByUsername("admin").isEmpty()) {
                var roles = new HashSet<String>();
                User user = User.builder()
                        .username("admin")
                        .fullName("Administrator")
                        .email("admin@example.com")
                        .role("ADMIN")
                        .passwordHash(passwordEncoder.encode("admin"))
                        .build();
                userRepository.save(user);
                log.warn("admin user has been created with default password: admin, please change it!");
            }
        };
    }
}
