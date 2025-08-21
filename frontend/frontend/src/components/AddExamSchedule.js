import React, { useState, useEffect } from 'react';
import {
    TextField,
    Button,
    Typography,
    Box,
    MenuItem,
    Select,
    FormControl,
    InputLabel,
    Grid,
    Alert,
    Container,
    Paper
} from '@mui/material';
import axios from 'axios';
import { configuration } from '../configurations/configuration';
import { useNavigate } from 'react-router-dom';

const AddExamSchedule = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const navigate = useNavigate();

// State
    const [form, setForm] = useState({
        examId: "",
        classId: "",
        instructorId: "",
        examDate: "",
        startTime: "",
        location: "",
        maxParticipants: ""
    });

    const [exams, setExams] = useState([]);
    const [classes, setClasses] = useState([]);
    const [instructors, setInstructors] = useState([]);

    // Fetch data for dropdowns
    useEffect(() => {
        const fetchData = async () => {
            try {
                const token = localStorage.getItem('jwtToken');
                
                // Fetch exams
                const examsResponse = await axios.get(
                    `${configuration.API_BASE_URL}/exams`,
                    { headers: { Authorization: `Bearer ${token}` } }
                );
                setExams(examsResponse.data || []);

                // Fetch classes
                const classesResponse = await axios.get(
                    `${configuration.API_BASE_URL}/api/classes`,
                    { headers: { Authorization: `Bearer ${token}` } }
                );
                setClasses(classesResponse.data || []);

                // Fetch instructors (users with role INSTRUCTOR)
                const usersResponse = await axios.get(
                    `${configuration.API_BASE_URL}/users`,
                    { headers: { Authorization: `Bearer ${token}` } }
                );
                const instructorUsers = (usersResponse.data || []).filter(user => user.role === 'INSTRUCTOR');
                setInstructors(instructorUsers);

            } catch (err) {
                console.error('Error fetching data:', err);
                setError('Không thể tải dữ liệu. Vui lòng thử lại.');
            }
        };

        fetchData();
    }, []);

    // handleChange
    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm({
            ...form,
            [name]: value // luôn là string
        });
    };

    // handleSubmit
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setSuccess('');

        try {
            const token = localStorage.getItem('jwtToken');

            const requestData = {
                examId: form.examId ? parseInt(form.examId) : null,
                classId: form.classId ? parseInt(form.classId) : null,
                instructorId: form.instructorId ? parseInt(form.instructorId) : null,
                examDate: form.examDate,
                startTime: form.startTime,
                location: form.location || null,
                maxParticipants: form.maxParticipants ? parseInt(form.maxParticipants) : null
            };

            await axios.post(
                `${configuration.API_BASE_URL}/exam-schedules`,
                requestData,
                { headers: { Authorization: `Bearer ${token}` } }
            );

            setSuccess('Tạo lịch thi thành công!');
            setTimeout(() => {
                navigate('/exam-schedules');
            }, 1500);

        } catch (err) {
            console.error('Error creating exam schedule:', err);
            setError(err.response?.data?.message || 'Tạo lịch thi thất bại. Vui lòng thử lại.');
        } finally {
            setLoading(false);
        }
    };

    const handleCancel = () => {
        navigate('/exam-schedules');
    };

    return (
                <Container maxWidth="sm" sx={{ mt: 4, mb: 4 }}>
            <Paper sx={{ p: 4 }}>
                <Typography variant="h4" gutterBottom align="center" sx={{ fontWeight: 'bold', color: 'black' }}>
                    Thêm Lịch Thi
                </Typography>

                {error && (
                    <Alert severity="error" sx={{ mb: 2 }}>
                        {error}
                    </Alert>
                )}

                {success && (
                    <Alert severity="success" sx={{ mb: 2 }}>
                        {success}
                    </Alert>
                )}

                <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, alignItems: 'center' }}>
                        <FormControl fullWidth required>
                            <InputLabel id="exam-label">Kỳ thi</InputLabel>
                            <Select
                                labelId="exam-label"
                                name="examId"
                                value={form.examId}
                                onChange={handleChange}
                            >
                                {exams.map((exam) => (
                                    <MenuItem key={exam.id} value={exam.id}>
                                        {exam.examName}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>

                        <FormControl fullWidth>
                            <InputLabel id="class-label">Lớp học</InputLabel>
                            <Select
                                labelId="class-label"
                                name="classId"
                                value={form.classId}
                                onChange={handleChange}
                            >
                                <MenuItem value="">
                                    <em>Không chọn lớp</em>
                                </MenuItem>
                                {classes.map((cls) => (
                                    <MenuItem key={cls.classId} value={cls.classId}>
                                        {cls.className}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>

                        <FormControl fullWidth>
                            <InputLabel id="instructor-label">Giảng viên</InputLabel>
                            <Select
                                labelId="instructor-label"
                                name="instructorId"
                                value={form.instructorId}
                                onChange={handleChange}
                            >
                                <MenuItem value="">
                                    <em>Không chọn giảng viên</em>
                                </MenuItem>
                                {instructors.map((instructor) => (
                                    <MenuItem key={instructor.id} value={instructor.id}>
                                        {instructor.firstName} {instructor.lastName}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>

                        <TextField
                            fullWidth
                            label="Địa điểm"
                            name="location"
                            value={form.location}
                            onChange={handleChange}
                            placeholder="Nhập địa điểm thi"
                        />

                        <TextField
                            fullWidth
                            required
                            label="Ngày thi *"
                            name="examDate"
                            type="date"
                            value={form.examDate}
                            onChange={handleChange}
                            InputLabelProps={{
                                shrink: true,
                            }}
                        />

                        <TextField
                            fullWidth
                            required
                            label="Giờ bắt đầu *"
                            name="startTime"
                            type="time"
                            value={form.startTime}
                            onChange={handleChange}
                            InputLabelProps={{
                                shrink: true,
                            }}
                        />

                        <TextField
                            fullWidth
                            label="Số lượng tối đa"
                            name="maxParticipants"
                            type="number"
                            value={form.maxParticipants}
                            onChange={handleChange}
                            placeholder="Nhập số lượng tối đa"
                            inputProps={{ min: 1 }}
                        />
                    </Box>

                    <Box sx={{ mt: 4, display: 'flex', flexDirection: 'column', gap: 2, alignItems: 'center' }}>
                        <Button
                            type="submit"
                            variant="contained"
                            color="primary"
                            disabled={loading || !form.examId || !form.examDate || !form.startTime}
                            fullWidth
                            sx={{ 
                                py: 1.5,
                                textTransform: 'uppercase',
                                fontWeight: 'bold'
                            }}
                        >
                            {loading ? 'Đang tạo...' : 'THÊM'}
                        </Button>
                        <Button
                            type="button"
                            variant="outlined"
                            onClick={handleCancel}
                            disabled={loading}
                            fullWidth
                            sx={{ 
                                py: 1.5,
                                textTransform: 'uppercase',
                                fontWeight: 'bold'
                            }}
                        >
                            HỦY
                        </Button>
                    </Box>
                </Box>
            </Paper>
        </Container>
    );
};

export default AddExamSchedule;
