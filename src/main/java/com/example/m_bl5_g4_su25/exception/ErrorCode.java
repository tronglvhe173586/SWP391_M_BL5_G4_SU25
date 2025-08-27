package com.example.m_bl5_g4_su25.exception;

import lombok.Getter;
import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;

@Getter
public enum ErrorCode {
    UNCATEGORIZED_EXCEPTION(9999, "Uncategorized error", HttpStatus.INTERNAL_SERVER_ERROR),
    INVALID_KEY(1001, "Uncategorized error", HttpStatus.BAD_REQUEST),
    USER_EXISTED(1002, "User existed", HttpStatus.BAD_REQUEST),
    USERNAME_INVALID(1003, "Username must be at least {min} characters", HttpStatus.BAD_REQUEST),
    PASSWORD_INVALID(1004, "Password must be at least {min} characters", HttpStatus.BAD_REQUEST),
    USER_NOT_EXISTED(1005, "Tên người dùng hoặc mật khẩu không đúng", HttpStatus.NOT_FOUND),
    UNAUTHENTICATED(1006, "Unauthenticated", HttpStatus.UNAUTHORIZED),
    UNAUTHORIZED(1007, "You do not have permission", HttpStatus.FORBIDDEN),
    INVALID_DOB(1008, "Your age must be at least {min}", HttpStatus.BAD_REQUEST),
    USER_NOT_FOUND(1009, "User not found", HttpStatus.NOT_FOUND),
    EXAM_SCHEDULE_NOT_FOUND(1010, "Exam schedule not found", HttpStatus.NOT_FOUND),
    EXAM_REGISTRATION_NOT_FOUND(1011, "Exam registration not found", HttpStatus.NOT_FOUND),
    EXAM_REGISTRATION_ALREADY_EXISTS(1012, "Exam registration already exists", HttpStatus.BAD_REQUEST),
    EXAM_SCHEDULE_FULL(1013, "Exam schedule is full", HttpStatus.BAD_REQUEST),
    INVALID_STATUS(1014, "Invalid status", HttpStatus.BAD_REQUEST),
    INTERNAL_SERVER_ERROR(1015, "Internal server error", HttpStatus.INTERNAL_SERVER_ERROR),
    EXAM_RESULT_ALREADY_EXISTS(1016, "Exam result already exists for this learner and exam schedule",
            HttpStatus.BAD_REQUEST),
    EXAM_RESULT_NOT_FOUND(1017, "Exam result not found", HttpStatus.NOT_FOUND),
    COURSE_NO_ENROLLED_LEARNERS(1018,"Course has no enrolled learners. Please enroll learners before registering.", HttpStatus.BAD_REQUEST);

    ErrorCode(int code, String message, HttpStatusCode statusCode) {
        this.code = code;
        this.message = message;
        this.statusCode = statusCode;
    }

    private final int code;
    private final String message;
    private final HttpStatusCode statusCode;
}
