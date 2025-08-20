package com.example.m_bl5_g4_su25.service;

import com.example.m_bl5_g4_su25.dto.request.AddInstructorRequest;
import com.example.m_bl5_g4_su25.dto.request.EditUserRequest;
import com.example.m_bl5_g4_su25.dto.request.UserCreationRequest;
import com.example.m_bl5_g4_su25.dto.response.ListUserResponse;
import com.example.m_bl5_g4_su25.dto.response.UserResponse;
import com.example.m_bl5_g4_su25.entity.InstructorProfile;
import com.example.m_bl5_g4_su25.entity.Provinces;
import com.example.m_bl5_g4_su25.entity.User;
import com.example.m_bl5_g4_su25.enums.Gender;
import com.example.m_bl5_g4_su25.repository.InstructorProfileRepository;
import com.example.m_bl5_g4_su25.repository.ProvinceRepository;
import com.example.m_bl5_g4_su25.repository.UserRepository;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service

public class UserService implements IUserService {

    private final UserRepository userRepository;
    private final InstructorProfileRepository instructorProfileRepository;
    private final PasswordEncoder passwordEncoder;
    private final ProvinceRepository provinceRepository;

    public UserService(UserRepository userRepository, InstructorProfileRepository instructorProfileRepository, PasswordEncoder passwordEncoder, ProvinceRepository provinceRepository) {
        this.userRepository = userRepository;
        this.instructorProfileRepository = instructorProfileRepository;
        this.passwordEncoder = passwordEncoder;
        this.provinceRepository = provinceRepository;
    }

    @Override
    public List<ListUserResponse> getAllUsers() {
        return userRepository.findAll().stream()
                .map(user -> new ListUserResponse(
                        user.getId(),
                        user.getUsername(),
                        user.getFirstName(),
                        user.getLastName(),
                        user.getEmail(),
                        user.getRole(),
                        user.getIsActive(),
                        user.getGender(),
                        user.getDateOfBirth()
                ))
                .collect(Collectors.toList());
    }

    @Override
    public ListUserResponse editUser(Long id, EditUserRequest request) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("User not found with id: " + id));

        user.setUsername(request.getUsername());
        user.setFirstName(request.getFirstName());
        user.setLastName(request.getLastName());
        user.setEmail(request.getEmail());
        user.setIsActive(request.getIsActive());

        User updated = userRepository.save(user);

        return new ListUserResponse(
                updated.getId(),
                updated.getUsername(),
                updated.getFirstName(),
                updated.getLastName(),
                updated.getEmail(),
                updated.getRole(),
                updated.getIsActive(),
                updated.getGender(),
                updated.getDateOfBirth()
        );
    }

    @Override
    public void addInstructor(AddInstructorRequest request) {
        Provinces province = null;
        if (request.getProvinceId() != null) {
            province = provinceRepository.findById(request.getProvinceId())
                    .orElseThrow(() -> new RuntimeException("Province not found"));
        }
        User user = new User();
        user.setUsername(request.getUsername());
        user.setPasswordHash(request.getPasswordHash());
        user.setEmail(request.getEmail());
        user.setFirstName(request.getFirstName());
        user.setLastName(request.getLastName());
        user.setProvince(province);
        user.setGender(Gender.valueOf(request.getGender()));
        user.setDateOfBirth(request.getDateOfBirth());
        user.setRole("INSTRUCTOR");
        user.setIsActive(true);
        userRepository.save(user);

        InstructorProfile profile = new InstructorProfile();
        profile.setUser(user);
        profile.setEmployeeId(generateEmployeeId());
        profile.setHireDate(LocalDate.now());
        profile.setAddress(request.getAddress());
        profile.setPhoneNumber(request.getPhoneNumber());
        profile.setCertificationInfo(request.getCertificationInfo());
        instructorProfileRepository.save(profile);
    }

    @Override
    public Page<ListUserResponse> getAllUsersPagination(String keyword, int page, int size) {
        Pageable pageable = PageRequest.of(page, size);

        Page<User> userPage;
        if (keyword != null && !keyword.trim().isEmpty()) {
            userPage = userRepository.findByUsernameContainingIgnoreCaseOrEmailContainingIgnoreCase(keyword, keyword, pageable);
        } else {
            userPage = userRepository.findAll(pageable);
        }

        return userPage.map(user -> new ListUserResponse(
                user.getId(),
                user.getUsername(),
                user.getFirstName(),
                user.getLastName(),
                user.getEmail(),
                user.getRole(),
                user.getIsActive(),
                user.getGender(),
                user.getDateOfBirth()
        ));
    }

    @Override
    public ListUserResponse getUserById(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("User not found with id: " + id));

        return new ListUserResponse(
                user.getId(),
                user.getUsername(),
                user.getFirstName(),
                user.getLastName(),
                user.getEmail(),
                user.getRole(),
                user.getIsActive(),
                user.getGender(),
                user.getDateOfBirth()
        );
    }

    @Override
    public UserResponse register(UserCreationRequest request) {
        Provinces province = null;
        if (request.getProvinceId() != null) {
            province = provinceRepository.findById(request.getProvinceId())
                    .orElseThrow(() -> new RuntimeException("Province not found"));
        }

        User user = User.builder()
                .username(request.getUsername())
                .passwordHash(passwordEncoder.encode(request.getPassword()))
                .email(request.getEmail())
                .firstName(request.getFirstName())
                .lastName(request.getLastName())
                .gender(Gender.valueOf(request.getGender()))
                .dateOfBirth(request.getDateOfBirth())
                .province(province)
                .role("LEARNER")
                .isActive(true)
                .build();

        user = userRepository.save(user);

        return UserResponse.builder()
                .id(user.getId())
                .username(user.getUsername())
                .firstName(user.getFirstName())
                .lastName(user.getLastName())
                .email(user.getEmail())
                .gender(user.getGender().name())
                .dateOfBirth(user.getDateOfBirth())
                .role(user.getRole())
                .provinceId(province.getId())
                .provinceName(province.getName())
                .build();
    }
    private String generateEmployeeId() {
        long count = instructorProfileRepository.count() + 1;
        String year = String.valueOf(LocalDate.now().getYear());
        return "EMP" + year + String.format("%04d", count);
    }
}
