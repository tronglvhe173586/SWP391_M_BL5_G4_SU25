import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
    Container,
    Typography,
    Paper,
    Box,
    TextField,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Button,
    Alert,
    CircularProgress,
    Grid,
    Card,
    CardContent,
    Chip
} from '@mui/material';
import { configuration } from '../configurations/configuration';
import { useNavigate } from 'react-router-dom';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

const AddExamResult = () => {
    const navigate = useNavigate();
    const [form, setForm] = useState({
        learnerId: '',
        examScheduleId: '',
        score: ''
    });
    
    const [learners, setLearners] = useState([]);
    const [examSchedules, setExamSchedules] = useState([]);
    const [loading, setLoading] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [selectedExamSchedule, setSelectedExamSchedule] = useState(null);
    const [passScore, setPassScore] = useState(null);

    useEffect(() => {
        fetchLearners();
        fetchExamSchedules();
    }, []);

    const fetchLearners = async () => {
        try {
            const token = localStorage.getItem('jwtToken');
            
            const response = await axios.get(
                `${configuration.API_BASE_URL}/users/learners`,
                { headers: { Authorization: `Bearer ${token}` } }
            );

            const learnerUsers = response.data || [];
            
            if (learnerUsers.length === 0) {
                setError('Không tìm thấy học viên nào trong hệ thống. Vui lòng kiểm tra dữ liệu người dùng.');
            } else {
                setLearners(learnerUsers);
                setError('');
            }
        } catch (err) {
            console.error('Error fetching learners:', err);
            
            let errorMessage = 'Không thể tải danh sách học viên';
            
            if (err.response) {
                if (err.response.status === 401) {
                    errorMessage = 'Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.';
                } else if (err.response.status === 403) {
                    errorMessage = 'Bạn không có quyền truy cập danh sách học viên.';
                } else if (err.response.status === 404) {
                    errorMessage = 'API endpoint không tồn tại. Vui lòng kiểm tra cấu hình backend.';
                } else if (err.response.status >= 500) {
                    errorMessage = 'Lỗi server. Vui lòng thử lại sau.';
                } else {
                    errorMessage = `Lỗi ${err.response.status}: ${err.response.data?.message || err.response.data || 'Không thể xác định lỗi'}`;
                }
            } else if (err.request) {
                errorMessage = 'Không thể kết nối đến server. Vui lòng kiểm tra kết nối mạng và đảm bảo backend đang chạy.';
            } else {
                errorMessage = `Lỗi: ${err.message}`;
            }
            
            setError(errorMessage);
        }
    };

    const fetchExamSchedules = async () => {
        try {
            const token = localStorage.getItem('jwtToken');
            const response = await axios.get(
                `${configuration.API_BASE_URL}/exam-schedules`,
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setExamSchedules(response.data.result || []);
        } catch (err) {
            console.error('Error fetching exam schedules:', err);
            setError('Không thể tải danh sách lịch thi');
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm(prev => ({
            ...prev,
            [name]: value
        }));

        if (name === 'examScheduleId') {
            const selectedSchedule = examSchedules.find(schedule => schedule.id == value);
            if (selectedSchedule) {
                setSelectedExamSchedule(selectedSchedule);
                setPassScore(selectedSchedule.passScore || 50);
            }
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        setError('');
        setSuccess('');

        if (!form.learnerId || !form.examScheduleId || !form.score) {
            setError('Vui lòng điền đầy đủ thông tin');
            setSubmitting(false);
            return;
        }

        const score = parseFloat(form.score);
        if (isNaN(score) || score < 0 || score > 100) {
            setError('Điểm phải là số từ 0 đến 100');
            setSubmitting(false);
            return;
        }

        try {
            const token = localStorage.getItem('jwtToken');
            const response = await axios.post(
                `${configuration.API_BASE_URL}/exam-results`,
                {
                    learnerId: parseInt(form.learnerId),
                    examScheduleId: parseInt(form.examScheduleId),
                    score: score
                },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            setSuccess('Thêm kết quả thi thành công!');
            setForm({ learnerId: '', examScheduleId: '', score: '' });
            setSelectedExamSchedule(null);
            setPassScore(null);

            setTimeout(() => {
                navigate('/exam-results');
            }, 2000);
        } catch (err) {
            console.error('Error creating exam result:', err);
            const errorMessage = err.response?.data?.message || 
                               err.response?.data || 
                               'Đã xảy ra lỗi khi thêm kết quả thi';
            setError(errorMessage);
        } finally {
            setSubmitting(false);
        }
    };

    const calculatePassStatus = (score) => {
        if (!passScore || !score) return null;
        return parseFloat(score) >= passScore;
    };

    const getPassStatusColor = (score) => {
        const isPassed = calculatePassStatus(score);
        if (isPassed === null) return 'default';
        return isPassed ? 'success' : 'error';
    };

    const getPassStatusLabel = (score) => {
        const isPassed = calculatePassStatus(score);
        if (isPassed === null) return 'Chưa có điểm';
        return isPassed ? 'Đạt' : 'Không đạt';
    };

    if (loading) {
        return (
            <Container maxWidth="md" sx={{ mt: 4, textAlign: 'center' }}>
                <CircularProgress />
                <Typography>Đang tải...</Typography>
            </Container>
        );
    }

    return (
        <Container maxWidth="md" sx={{ mt: 4 }}>
            <Box sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 2 }}>
                <Button
                    startIcon={<ArrowBackIcon />}
                    onClick={() => navigate('/exam-results')}
                    variant="outlined"
                >
                    Quay lại
                </Button>
                <Typography variant="h4">Thêm Kết Quả Thi</Typography>
            </Box>

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

            <Paper sx={{ p: 3, mb: 3 }}>
                <Typography variant="h6" gutterBottom>
                    Thông tin kết quả thi
                </Typography>
                
                <Alert severity="info" sx={{ mb: 2 }}>
                    <Typography variant="body2">
                        <strong>Lưu ý:</strong> Điểm đạt được lấy tự động từ cấu hình bài thi.
                        Hệ thống sẽ so sánh điểm thi của học viên với điểm đạt để xác định kết quả đạt/không đạt.
                    </Typography>
                </Alert>
                
                <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
                    <Grid container spacing={3}>
                        <Grid item xs={12}>
                            <FormControl fullWidth required>
                                <InputLabel>Học viên</InputLabel>
                                <Select
                                    name="learnerId"
                                    value={form.learnerId}
                                    onChange={handleChange}
                                    label="Học viên"
                                    sx={{ minWidth: 400 }}
                                >
                                    {learners.map((learner) => (
                                        <MenuItem key={learner.id} value={learner.id}>
                                            {learner.firstName} {learner.lastName} - {learner.email}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Grid>

                        <Grid item xs={12}>
                            <FormControl fullWidth required>
                                <InputLabel>Lịch thi</InputLabel>
                                <Select
                                    name="examScheduleId"
                                    value={form.examScheduleId}
                                    onChange={handleChange}
                                    label="Lịch thi"
                                    sx={{ minWidth: 400 }}
                                >
                                    {examSchedules.map((schedule) => (
                                        <MenuItem key={schedule.id} value={schedule.id}>
                                            {schedule.examName} - {schedule.examDate} - {schedule.className || 'N/A'}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Grid>

                        <Grid item xs={12} md={6}>
                            <TextField
                                fullWidth
                                label="Điểm"
                                name="score"
                                type="number"
                                value={form.score}
                                onChange={handleChange}
                                required
                                inputProps={{
                                    min: 0,
                                    max: 100,
                                    step: 0.01
                                }}
                                helperText="Nhập điểm từ 0.0 đến 100.0"
                            />
                        </Grid>

                        <Grid item xs={12} md={6}>
                            <TextField
                                fullWidth
                                label="Điểm đạt (tự động)"
                                value={passScore || 'Chọn lịch thi trước'}
                                InputProps={{ readOnly: true }}
                                helperText="Điểm tối thiểu để đạt kỳ thi"
                                sx={{ backgroundColor: '#f5f5f5' }}
                            />
                        </Grid>
                    </Grid>

                    <Box sx={{ mt: 3, display: 'flex', gap: 2 }}>
                        <Button
                            type="submit"
                            variant="contained"
                            disabled={submitting}
                            sx={{ minWidth: 120 }}
                        >
                            {submitting ? <CircularProgress size={24} /> : 'Thêm kết quả'}
                        </Button>
                        
                        <Button
                            variant="outlined"
                            onClick={() => navigate('/exam-results')}
                        >
                            Hủy
                        </Button>
                    </Box>
                </Box>
            </Paper>

            {/* Preview Section */}
            {form.score && passScore && (
                <Paper sx={{ p: 3 }}>
                    <Typography variant="h6" gutterBottom>
                        Xem trước kết quả
                    </Typography>
                    
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                        Điểm đạt được lấy tự động từ cấu hình bài thi
                    </Typography>
                    
                    <Grid container spacing={2}>
                        <Grid item xs={12} md={4}>
                            <Card>
                                <CardContent>
                                    <Typography variant="subtitle2" color="text.secondary">
                                        Điểm thi
                                    </Typography>
                                    <Typography variant="h4" sx={{ mt: 1 }}>
                                        {form.score}
                                    </Typography>
                                </CardContent>
                            </Card>
                        </Grid>
                        
                        <Grid item xs={12} md={4}>
                            <Card>
                                <CardContent>
                                    <Typography variant="subtitle2" color="text.secondary">
                                        Điểm đạt
                                    </Typography>
                                    <Typography variant="h4" sx={{ mt: 1 }}>
                                        {passScore}
                                    </Typography>
                                </CardContent>
                            </Card>
                        </Grid>
                        
                        <Grid item xs={12} md={4}>
                            <Card>
                                <CardContent>
                                    <Typography variant="subtitle2" color="text.secondary">
                                        Kết quả
                                    </Typography>
                                    <Box sx={{ mt: 1 }}>
                                        <Chip
                                            label={getPassStatusLabel(form.score)}
                                            color={getPassStatusColor(form.score)}
                                            size="large"
                                            variant="filled"
                                        />
                                    </Box>
                                </CardContent>
                            </Card>
                        </Grid>
                    </Grid>
                </Paper>
            )}
        </Container>
    );
};

export default AddExamResult;
