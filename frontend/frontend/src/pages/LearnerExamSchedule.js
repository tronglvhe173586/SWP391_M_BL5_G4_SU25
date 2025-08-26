import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { DataGrid } from '@mui/x-data-grid';
import { Paper, Box, Container, Typography, Chip, Alert, Button, CircularProgress } from '@mui/material';
import { viVN } from '@mui/x-data-grid/locales';
import { configuration } from '../configurations/configuration';
import { useNavigate } from 'react-router-dom';
import VisibilityIcon from "@mui/icons-material/Visibility";
import { IconButton, Tooltip } from '@mui/material';
import { getToken } from '../services/localStorageService';

const LearnerExamSchedule = () => {
    const [examSchedules, setExamSchedules] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    // Get user role and ID from localStorage
    const userRole = localStorage.getItem('userRole');
    const learnerId = localStorage.getItem('userId');

    // Debug logging
    useEffect(() => {
        console.log('Current userRole:', userRole);
        console.log('Current learnerId:', learnerId);
        console.log('All localStorage keys:', Object.keys(localStorage));
        console.log('accessToken exists:', !!localStorage.getItem('accessToken'));
        console.log('jwtToken exists:', !!localStorage.getItem('jwtToken'));
    }, [userRole, learnerId]);

    // Check if user is a learner and redirect if necessary
    useEffect(() => {
        if (userRole && userRole !== 'ROLE_LEARNER') {
            // Redirect non-learner users to appropriate page
            if (userRole === 'ROLE_ADMIN') {
                navigate('/users');
            } else if (userRole === 'ROLE_INSTRUCTOR') {
                navigate('/instructors');
            } else {
                navigate('/login');
            }
        }
    }, [userRole, navigate]);

    // Fetch exam schedules
    useEffect(() => {
        if (learnerId && userRole === 'ROLE_LEARNER') {
            const fetchExamSchedules = async () => {
                if (!learnerId) {
                    setError('Không tìm thấy thông tin người dùng. Vui lòng đăng nhập lại.');
                    return;
                }

                if (userRole !== 'ROLE_LEARNER') {
                    setError('Bạn không có quyền truy cập trang này. Vui lòng đăng nhập lại.');
                    return;
                }

                setLoading(true);
                setError(null);
                try {
                    const token = getToken();
                    console.log('Token retrieved:', token ? 'Token exists' : 'No token');
                    console.log('User role:', userRole);
                    console.log('User ID:', learnerId);
                    
                    if (!token) {
                        setError('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.');
                        setLoading(false);
                        return;
                    }
                    
                    // Decode and log token content for debugging
                    try {
                        const decodedToken = JSON.parse(atob(token.split('.')[1]));
                        console.log('Decoded token claims:', decodedToken);
                        console.log('Token role:', decodedToken.role);
                        console.log('Token userId:', decodedToken.userId);
                    } catch (e) {
                        console.log('Could not decode token:', e);
                    }
                    
                    const response = await axios.get(
                        `${configuration.API_BASE_URL}/exam-schedules/learner/my-schedules`,
                        { headers: { Authorization: `Bearer ${token}` } }
                    );
                    setExamSchedules(response.data.result || []);
                } catch (err) {
                    console.error('Lỗi khi lấy lịch thi:', err);
                    console.error('Error response:', err.response);
                    console.error('Error status:', err.response?.status);
                    console.error('Error data:', err.response?.data);
                    console.error('Error headers:', err.response?.headers);
                    
                    if (err.response?.status === 403) {
                        setError('Bạn không có quyền truy cập trang này. Vui lòng đăng nhập với tài khoản học viên.');
                    } else if (err.response?.status === 401) {
                        setError('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.');
                    } else {
                        setError('Có lỗi xảy ra khi lấy thông tin lịch thi. Vui lòng thử lại sau.');
                    }
                } finally {
                    setLoading(false);
                }

            };

            fetchExamSchedules();
        }
    }, [learnerId, userRole]);



    const columns = [
        { field: 'id', headerName: 'ID', width: 70 },
        { field: 'examName', headerName: 'Tên kỳ thi', width: 200 },
        { field: 'examType', headerName: 'Loại thi', width: 120 },
        { field: 'className', headerName: 'Lớp', width: 160 },
        { field: 'examDate', headerName: 'Ngày thi', width: 140 },
        { field: 'startTime', headerName: 'Giờ bắt đầu', width: 140 },
        { field: 'location', headerName: 'Địa điểm', width: 180 },
        { field: 'instructorName', headerName: 'Giảng viên', width: 150 },
        {
            field: 'registrationStatus',
            headerName: 'Trạng thái đăng ký',
            width: 150,
            renderCell: (params) => {
                const status = params.value;
                let color = 'default';
                let label = status;

                switch (status) {
                    case 'PENDING':
                        color = 'warning';
                        label = 'Chờ xử lý';
                        break;
                    case 'APPROVED':
                        color = 'success';
                        label = 'Đã duyệt';
                        break;
                    case 'REJECTED':
                        color = 'error';
                        label = 'Từ chối';
                        break;
                    case 'NOT_REGISTERED':
                        color = 'default';
                        label = 'Chưa đăng ký';
                        break;
                    default:
                        color = 'default';
                        label = status;
                }

                return <Chip label={label} color={color} size="small" />;
            }
        },
        {
            field: 'examResult',
            headerName: 'Kết quả',
            width: 100,
            renderCell: (params) => {
                const result = params.value;
                if (result === 'N/A') {
                    return <Chip label="Chưa có" color="default" size="small" />;
                }
                return <Chip label={result} color="primary" size="small" />;
            }
        },
        {
            field: 'view',
            headerName: 'Chi tiết',
            width: 80,
            renderCell: (params) => (
                <Tooltip title="Xem chi tiết">
                    <IconButton
                        color="primary"
                        size="small"
                        onClick={() => navigate(`/exam-schedules/${params.row.id}`)}
                    >
                        <VisibilityIcon />
                    </IconButton>
                </Tooltip>
            )
        }
    ];

    // Check if user is logged in
    if (!userRole || !learnerId) {
        return (
            <Container maxWidth="md" sx={{ mt: 4 }}>
                <Alert severity="info" sx={{ mb: 2 }}>
                    Vui lòng đăng nhập để xem lịch thi của bạn.
                </Alert>
                <Button 
                    variant="contained" 
                    onClick={() => navigate('/login')}
                    sx={{ mt: 2 }}
                >
                    Đăng nhập
                </Button>
            </Container>
        );
    }

    // If not a learner, don't render the component
    if (userRole && userRole !== 'ROLE_LEARNER') {
        return (
            <Container maxWidth="md" sx={{ mt: 4 }}>
                <Alert severity="warning" sx={{ mb: 2 }}>
                    Trang này chỉ dành cho học viên. Bạn đang đăng nhập với vai trò {userRole.replace('ROLE_', '')}.
                </Alert>
                <Button 
                    variant="contained" 
                    onClick={() => navigate('/login')}
                    sx={{ mt: 2 }}
                >
                    Đăng nhập với tài khoản học viên
                </Button>
            </Container>
        );
    }

    if (loading) {
        return (
            <Container maxWidth="lg" sx={{ mt: 4 }}>
                <Box display="flex" justifyContent="center">
                    <CircularProgress />
                </Box>
            </Container>
        );
    }

    if (error) {
        return (
            <Container maxWidth="md" sx={{ mt: 4 }}>
                <Alert severity="error" sx={{ mb: 2 }}>
                    {error}
                </Alert>
                <Button 
                    variant="contained" 
                    onClick={() => navigate('/login')}
                    sx={{ mt: 2 }}
                >
                    Đăng nhập lại
                </Button>
            </Container>
        );
    }

    if (examSchedules.length === 0) {
        return (
            <Container maxWidth="lg" sx={{ mt: 4 }}>
                <Paper sx={{ p: 3, textAlign: 'center' }}>
                    <Typography variant="h6" gutterBottom>
                        Không có lịch thi nào
                    </Typography>
                    <Typography variant="body1" color="text.secondary">
                        Bạn chưa được đăng ký vào lớp học nào hoặc chưa có lịch thi được lên kế hoạch.
                    </Typography>
                </Paper>
            </Container>
        );
    }

    return (
        <Container maxWidth="lg" sx={{ mt: 4 }}>
            <Typography variant="h4" gutterBottom>
                Lịch thi của tôi
            </Typography>
            
            {error && (
                <Alert severity="error" sx={{ mb: 2 }}>
                    {error}
                </Alert>
            )}

            <Paper sx={{ height: 600, width: '100%' }}>
                <DataGrid
                    rows={examSchedules}
                    columns={columns}
                    pageSizeOptions={[10, 20, 50]}
                    initialState={{
                        pagination: { paginationModel: { page: 0, pageSize: 10 } },
                    }}
                    loading={loading}
                    disableRowSelectionOnClick
                    localeText={viVN.components.MuiDataGrid.defaultProps.localeText}
                    getRowClassName={(params) => {
                        // Highlight upcoming exams
                        const examDate = new Date(params.row.examDate);
                        const today = new Date();
                        today.setHours(0, 0, 0, 0);
                        
                        if (examDate > today) {
                            return 'upcoming-exam';
                        }
                        return '';
                    }}
                />
            </Paper>

            {examSchedules.length === 0 && !loading && !error && (
                <Alert severity="info" sx={{ mt: 2 }}>
                    Bạn chưa có lịch thi nào. Hãy liên hệ với giảng viên để được sắp xếp lịch thi.
                </Alert>
            )}
        </Container>
    );
};

export default LearnerExamSchedule;
