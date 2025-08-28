package com.example.m_bl5_g4_su25.repository;

import com.example.m_bl5_g4_su25.dto.request.ChangePasswordRequest;
import com.example.m_bl5_g4_su25.entity.User;
import com.example.m_bl5_g4_su25.enums.Role;
import jakarta.transaction.Transactional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import com.example.m_bl5_g4_su25.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    Page<User> findByUsernameContainingIgnoreCaseOrEmailContainingIgnoreCase(
            String username, String email, Pageable pageable
    );
    Optional<User> findByUsername(String username);
    boolean existsByUsername(String username);
    boolean existsByEmail(String email);
    Optional<User> findByEmail(String email);

    @Query("SELECT u FROM User u WHERE u.role = :role")
    List<User> findByRole(@Param("role") Role role);

    @Modifying
    @Transactional
    @Query("update User u set u.passwordHash = ?2 where u.email = ?1")
    void updatePassword(String email, String password);
    Optional<User> findByIdAndRole(Long id, Role role);

}
