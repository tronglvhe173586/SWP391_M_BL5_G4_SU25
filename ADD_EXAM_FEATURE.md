# Add Exam Feature

This document describes the "Add Exam" feature that has been implemented in the SWP391_M_BL5_G4_SU25 project.

## Overview

The add exam feature allows administrators to create new exams with details including exam name, exam type, and pass score. The feature includes comprehensive validation to ensure data integrity and prevent duplicate exam names.

## API Endpoints

### Create New Exam

- **URL**: `POST /exams`
- **Description**: Creates a new exam with the provided details
- **Request Body**: `ExamCreateRequest`
- **Response**: `ExamResponse` object with created exam details
- **Status Code**: `201 Created`

## Request/Response Models

### ExamCreateRequest

```json
{
  "examName": "Advanced Driving Theory",
  "examType": "THEORY|SIMULATION|PRACTICAL|ON_THE_ROAD",
  "passScore": 75
}
```

### ExamResponse

```json
{
  "id": 1,
  "examName": "Advanced Driving Theory",
  "examType": "THEORY",
  "passScore": 75
}
```

## Validation Rules

### Input Validation

- **examName**:
  - Required
  - Maximum 100 characters
  - Cannot be null or empty
  - Must be unique (no duplicate exam names allowed)
- **examType**:
  - Required
  - Must be one of: THEORY, SIMULATION, PRACTICAL, ON_THE_ROAD
- **passScore**:
  - Required
  - Must be between 0 and 100

### Business Rules

- Exam names must be unique across the system
- Exam names are trimmed of leading/trailing whitespace
- Duplicate exam names are not allowed

## Error Handling

The feature includes comprehensive error handling:

1. **ExamValidationException**: Thrown for validation errors
2. **MethodArgumentNotValidException**: Handled for invalid request data
3. **Global Exception Handler**: Provides consistent error responses

### Error Response Format

```json
{
  "error": "Validation error",
  "message": "Detailed error message"
}
```

### Common Error Scenarios

- **Duplicate Exam Name**: `"Exam with name 'Advanced Driving Theory' already exists"`
- **Empty Exam Name**: `"Exam name cannot be null or empty"`
- **Invalid Pass Score**: `"Pass score must be at least 0"` or `"Pass score must not exceed 100"`
- **Missing Required Fields**: Field-specific validation messages

## Usage Examples

### Create a New Exam

```bash
curl -X POST http://localhost:8080/exams \
  -H "Content-Type: application/json" \
  -d '{
    "examName": "Advanced Driving Theory",
    "examType": "THEORY",
    "passScore": 80
  }'
```

### Expected Success Response

```json
{
  "id": 1,
  "examName": "Advanced Driving Theory",
  "examType": "THEORY",
  "passScore": 80
}
```

### Example with Validation Error

```bash
curl -X POST http://localhost:8080/exams \
  -H "Content-Type: application/json" \
  -d '{
    "examName": "",
    "examType": "THEORY",
    "passScore": 80
  }'
```

### Expected Error Response

```json
{
  "error": "Validation error",
  "message": "Exam name cannot be null or empty"
}
```

## Implementation Details

### Files Created/Modified

1. **ExamCreateRequest.java** - Request DTO with validation
2. **ExamValidationException.java** - Custom exception for validation errors
3. **ExamController.java** - Added POST endpoint for creating exams
4. **ExamService.java** - Added createExam method with validation
5. **IExamService.java** - Updated interface with create method
6. **ExamRepository.java** - Added existsByExamName method
7. **GlobalExceptionHandler.java** - Added validation exception handling
8. **ExamServiceTest.java** - Added comprehensive unit tests

### Key Features

- **Input Validation**: Comprehensive validation using Jakarta Validation
- **Business Logic Validation**: Custom validation for exam name uniqueness
- **Error Handling**: Proper exception handling with meaningful error messages
- **Testing**: Unit tests covering success and failure scenarios
- **RESTful Design**: Follows REST conventions
- **Type Safety**: Strong typing with enums for exam types

## Database Changes

### Repository Method Added

```java
boolean existsByExamName(String examName);
```

This method checks if an exam with the given name already exists in the database.

## Testing

Run the tests using:

```bash
mvn test -Dtest=ExamServiceTest
```

The tests cover:

- Successful exam creation
- Duplicate exam name validation
- Empty exam name validation
- Null exam name validation
- All existing functionality (get, update)

### Test Scenarios

1. **createExam_Success**: Tests successful exam creation
2. **createExam_DuplicateName**: Tests duplicate name validation
3. **createExam_EmptyName**: Tests empty name validation
4. **createExam_NullName**: Tests null name validation

## Security Considerations

- Input validation prevents malicious data
- Proper error handling avoids information disclosure
- RESTful design follows security best practices
- Validation prevents duplicate exam names

## Performance Considerations

- Database query optimization for name uniqueness check
- Efficient validation flow
- Proper exception handling to avoid unnecessary database calls

## Future Enhancements

Potential improvements for the future:

1. Add audit logging for exam creation
2. Implement role-based access control
3. Add bulk exam creation capability
4. Include exam description field
5. Add exam duration field
6. Implement exam templates
7. Add versioning for exam changes

## Integration with Existing Features

The add exam feature integrates seamlessly with existing functionality:

- Uses the same Exam entity and ExamResponse DTO
- Follows the same validation patterns as the update feature
- Maintains consistency with existing error handling
- Extends the existing service interface

## API Documentation

The feature follows OpenAPI/Swagger conventions and can be documented using:

- SpringDoc OpenAPI
- Swagger annotations
- RESTful URL patterns
- Standard HTTP status codes
