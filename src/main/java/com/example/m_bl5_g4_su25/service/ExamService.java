package com.example.m_bl5_g4_su25.service;

import com.example.m_bl5_g4_su25.dto.response.ExamResponse;
import com.example.m_bl5_g4_su25.entity.Exam;
import com.example.m_bl5_g4_su25.exception.ExamNotFoundException;
import com.example.m_bl5_g4_su25.exception.ExamValidationException;
import com.example.m_bl5_g4_su25.repository.ExamRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class ExamService implements IExamService {

    @Autowired
    private ExamRepository examRepository;

    public List<ExamResponse> getAllExams() {
        List<Exam> exams = examRepository.findAll();
        return exams.stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    @Override
    public ExamResponse getExamById(Long examId) {
        Optional<Exam> examOptional = examRepository.findById(examId);
        if (examOptional.isPresent()) {
            return convertToResponse(examOptional.get());
        } else {
            throw new ExamNotFoundException(examId);
        }
    }

    @Override
    public ExamResponse createExam(Exam exam) {
        validateExamName(exam.getExamName());

        Exam savedExam = examRepository.save(exam);
        return convertToResponse(savedExam);
    }

    @Override
    public ExamResponse updateExam(Long examId, Exam examDetails) {
        Optional<Exam> examOptional = examRepository.findById(examId);

        if (examOptional.isPresent()) {
            Exam exam = examOptional.get();
            exam.setExamName(examDetails.getExamName());
            exam.setExamType(examDetails.getExamType());
            exam.setPassScore(examDetails.getPassScore());

            Exam updatedExam = examRepository.save(exam);
            return convertToResponse(updatedExam);
        } else {
            throw new ExamNotFoundException(examId);
        }
    }

    private ExamResponse convertToResponse(Exam exam) {
        return new ExamResponse(
                exam.getId(),
                exam.getExamName(),
                exam.getExamType(),
                exam.getPassScore());
    }

    private void validateExamName(String examName) {
        if (examName == null || examName.trim().isEmpty()) {
            throw new ExamValidationException("Exam name cannot be null or empty");
        }

        if (examRepository.existsByExamName(examName.trim())) {
            throw new ExamValidationException("Exam with name '" + examName + "' already exists");
        }
    }
}
