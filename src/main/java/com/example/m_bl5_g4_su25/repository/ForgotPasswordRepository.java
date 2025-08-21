package com.example.m_bl5_g4_su25.repository;

import com.example.m_bl5_g4_su25.entity.ForgotPassword;
import com.example.m_bl5_g4_su25.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ForgotPasswordRepository extends JpaRepository<ForgotPassword,Integer> {
    @Query("select fp from ForgotPassword fp where fp.otp = ?1 and fp.user = ?2")
    Optional<ForgotPassword> findByOtpAndUser(Integer otp, User user);
    Optional<ForgotPassword> findByUser(User user);
    void deleteAllByUser(User user);
}
