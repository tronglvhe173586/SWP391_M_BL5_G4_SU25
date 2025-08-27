import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Container, Typography, Paper, Box, Button, TextField, MenuItem, CircularProgress } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { viVN } from '@mui/x-data-grid/locales';

const ExamRegistration = () => {
    const [rows, setRows] = useState([]);
    const [loading, setLoading] = useState(false);
    const [courses, setCourses] = useState([]);
    const [selectedCourseId, setSelectedCourseId] = useState('');
    const [isRegistering, setIsRegistering] = useState(false);
    const [registrationStatus, setRegistrationStatus] = useState({});

    const getStatusLabel = (status) => {
        if (!status) return 'Đăng ký';
        if (status === 'PENDING') return 'Chờ xét duyệt';
        if (status === 'CONFIRMED') return 'Đã chấp thuận';
        if (status === 'CANCELLED') return 'Bị từ chối';
        return 'Đăng ký';
    };

    const columns = [
        { field: 'id', headerName: 'ID', width: 80 },
        { field: 'examName', headerName: 'Kỳ thi', width: 180 },
        { field: 'className', headerName: 'Lớp', width: 160 },
        { field: 'examDate', headerName: 'Ngày thi', width: 130 },
        { field: 'startTime', headerName: 'Giờ bắt đầu', width: 130 },
        { field: 'location', headerName: 'Địa điểm', width: 180 },
        { field: 'maxParticipants', headerName: 'Số lượng tối đa', width: 150 },
        {
            field: 'actions',
            headerName: 'Trạng thái',
            width: 180,
            sortable: false,
            renderCell: (params) => {
                const status = registrationStatus[params.row.id];
                const label = getStatusLabel(status);
                const isDisabled = Boolean(status) || !selectedCourseId || isRegistering;
                return (
                    <Button
                        variant="contained"
                        disabled={isDisabled}
                        onClick={() => handleRegister(params.row.id)}
                    >
                        {isRegistering ? <CircularProgress size={20} color="inherit" /> : label}
                    </Button>
                );
            },
        },
    ];

    const fetchSchedules = async () => {
        setLoading(true);
        try {
            const resp = await axios.get(`/driving-school-management/exam-schedules`);
            setRows(resp.data.result || []);
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    const fetchCourses = async () => {
        try {
            const resp = await axios.get(`/driving-school-management/courses/all`);
            setCourses(resp.data || []);
        } catch (e) {
            console.error("Lỗi khi lấy courses:", e);
        }
    };

    const fetchRegistrationStatus = async (courseId, scheduleIds) => {
        if (!courseId || scheduleIds.length === 0) {
            setRegistrationStatus({});
            return;
        }
        try {
            const qs = encodeURIComponent(scheduleIds.join(','));
            const resp = await axios.get(`/driving-school-management/exam-registrations/course/${courseId}/statuses?examScheduleIds=${qs}`);
            setRegistrationStatus(resp?.data?.result || {});
        } catch (e) {
            console.error("Lỗi khi lấy trạng thái đăng ký:", e);
        }
    };
    const fetchData = async () => {
        setLoading(true);
        try {
            const [schedulesResp, coursesResp] = await Promise.all([
                axios.get(`/driving-school-management/exam-schedules`),
                axios.get(`/driving-school-management/courses/all`)
            ]);
            setRows(schedulesResp.data.result || []);
            setCourses(coursesResp.data || []);
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    const handleRegister = async (scheduleId) => {
        if (!selectedCourseId) {
            alert('Vui lòng chọn khóa học.');
            return;
        }
        setIsRegistering(true);
        try {
            await axios.post(`/driving-school-management/exam-registrations/course/${selectedCourseId}`, {
                examScheduleId: scheduleId,
            });
            const scheduleIds = rows.map(row => row.id);
            await fetchRegistrationStatus(selectedCourseId, scheduleIds);
        } catch (e) {
            const msg = e?.response?.data?.message || 'Đăng ký thất bại';
            alert(msg);
        } finally {
            setIsRegistering(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);


    useEffect(() => {
        if (selectedCourseId) {
            const scheduleIds = rows.map(row => row.id);
            fetchRegistrationStatus(selectedCourseId, scheduleIds);
        } else {
            setRegistrationStatus({});
        }
    }, [selectedCourseId, rows]);

    return (
        <Container maxWidth="lg" sx={{ mt: 4 }}>
            <Typography variant="h4" gutterBottom>
                Đăng ký thi cho khóa học
            </Typography>

            <Paper sx={{ p: 2, mb: 3 }}>
                <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
                    Chọn khóa học để đăng ký thi:
                </Typography>
                <TextField
                    select
                    label="Khóa học"
                    value={selectedCourseId}
                    onChange={(e) => setSelectedCourseId(e.target.value)}
                    fullWidth
                >
                    <MenuItem value="">
                        <em>Chọn một khóa học</em>
                    </MenuItem>
                    {courses.length > 0 ? (
                        courses.map((course) => (
                            <MenuItem key={course.id} value={course.id}>
                                {course.courseName}
                            </MenuItem>
                        ))
                    ) : (
                        <MenuItem disabled>Không có khóa học nào</MenuItem>
                    )}
                </TextField>
            </Paper>

            <Paper sx={{ height: 520, width: '100%' }}>
                <DataGrid
                    rows={rows}
                    columns={columns}
                    pageSizeOptions={[10, 20]}
                    initialState={{ pagination: { paginationModel: { page: 0, pageSize: 10 } } }}
                    loading={loading}
                    disableRowSelectionOnClick
                    localeText={viVN.components.MuiDataGrid.defaultProps.localeText}
                />
            </Paper>
        </Container>
    );
};

export default ExamRegistration;