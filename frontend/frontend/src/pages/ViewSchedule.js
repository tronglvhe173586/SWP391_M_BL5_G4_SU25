import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
    Container, Box, Typography, Button, Table, TableContainer, TableHead, TableRow, TableCell, TableBody,
    Paper, Alert, CircularProgress, IconButton, Tooltip, TextField, MenuItem
} from '@mui/material';
import {
    Add as AddIcon, Edit as EditIcon, Visibility as VisibilityIcon, ArrowBack as ArrowBackIcon,
} from '@mui/icons-material';

const ViewSchedule = () => {
    const [classId, setClassId] = useState('');
    const [schedules, setSchedules] = useState([]);
    const [filteredSchedules, setFilteredSchedules] = useState([]);
    const [selectedSchedule, setSelectedSchedule] = useState(null);
    const [mode, setMode] = useState('list');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const [filterYear, setFilterYear] = useState('');
    const [filterWeek, setFilterWeek] = useState('');

    const [formValues, setFormValues] = useState({
        classId: '',
        dayOfWeek: '',
        date: '',
        slot: '',
        topic: '',
    });

    const formatDate = (date) => {
        const d = new Date(date);
        const day = d.getDate().toString().padStart(2, '0');
        const month = (d.getMonth() + 1).toString().padStart(2, '0');
        return `${day}/${month}`;
    };

    const getISOWeek = (date) => {
        const d = new Date(date);
        d.setHours(0, 0, 0, 0);
        d.setDate(d.getDate() + 4 - (d.getDay() || 7));
        const yearStart = new Date(d.getFullYear(), 0, 1);
        const weekNo = Math.ceil((((d - yearStart) / 86400000) + 1) / 7);
        return weekNo;
    };

    const getDayOfWeekString = (date) => {
        const days = ['SUNDAY', 'MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY'];
        return days[new Date(date).getDay()];
    };

    const years = [];
    const currentYear = new Date().getFullYear();
    for (let i = currentYear - 5; i <= currentYear + 5; i++) {
        years.push(i.toString());
    }

    const weeksInYear = (year) => {
        const weeks = [];
        const d = new Date(year, 0, 1);
        let weekNumber = 1;

        while (d.getFullYear() === year || (d.getFullYear() === year + 1 && getISOWeek(d) === 1)) {
            const startOfWeek = new Date(d);
            const endOfWeek = new Date(d);
            endOfWeek.setDate(d.getDate() + 6);

            weeks.push({
                value: weekNumber.toString(),
                label: `Tuần ${weekNumber} (${formatDate(startOfWeek)} - ${formatDate(endOfWeek)})`
            });

            weekNumber++;
            d.setDate(d.getDate() + 7);
            if (d.getFullYear() > year + 1) break;
        }
        return weeks;
    };

    useEffect(() => {
        if (schedules.length > 0) {
            let tempSchedules = schedules;

            if (filterYear) {
                tempSchedules = tempSchedules.filter(schedule => {
                    const scheduleYear = new Date(schedule.date).getFullYear();
                    return scheduleYear.toString() === filterYear;
                });
            }

            if (filterWeek && filterYear) {
                tempSchedules = tempSchedules.filter(schedule => {
                    const weekOfYear = getISOWeek(new Date(schedule.date));
                    return weekOfYear.toString() === filterWeek;
                });
            }
            setFilteredSchedules(tempSchedules);
        } else {
            setFilteredSchedules([]);
        }
    }, [schedules, filterYear, filterWeek]);

    const handleFetchSchedules = async () => {
        if (!classId) {
            setError('Vui lòng nhập ID lớp học.');
            setSchedules([]);
            setFilteredSchedules([]);
            return;
        }
        setIsLoading(true);
        setError('');
        setSchedules([]);
        setFilteredSchedules([]);
        try {
            const response = await axios.get(`/driving-school-management/schedules/by-class/${classId}`);
            if (response.data && response.data.length > 0) {
                setSchedules(response.data);

                const now = new Date();
                setFilterYear(now.getFullYear().toString());
                setFilterWeek(getISOWeek(now).toString());
            } else {
                setError('Không tìm thấy lịch học cho ID lớp học này.');
                setSchedules([]);
            }
        } catch (err) {
            console.error('API Error:', err.response ? err.response.data : err.message);
            setError('Lỗi khi tải lịch học. Vui lòng kiểm tra ID lớp học và thử lại.');
            setSchedules([]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleViewDetails = (schedule) => {
        setSelectedSchedule(schedule);
        setMode('details');
    };

    const handleAddScheduleClick = () => {
        setMode('add');
        setFormValues({
            classId: classId,
            dayOfWeek: '',
            date: '',
            slot: '',
            topic: '',
        });
    };

    const handleEditScheduleClick = (schedule) => {
        setSelectedSchedule(schedule);
        setMode('edit');
        const slotString = `${schedule.startTime}-${schedule.endTime}`;
        setFormValues({
            classId: schedule.classId,
            dayOfWeek: schedule.dayOfWeek,
            date: schedule.date,
            slot: slotString,
            topic: schedule.topic,
        });
    };

    const handleFormChange = (e) => {
        const { name, value } = e.target;

        if (name === 'date') {
            const dayOfWeek = getDayOfWeekString(value);
            setFormValues({ ...formValues, date: value, dayOfWeek: dayOfWeek });
        } else {
            setFormValues({ ...formValues, [name]: value });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        if (!formValues.classId || !formValues.dayOfWeek || !formValues.date || !formValues.slot) {
            setError('Vui lòng điền đầy đủ thông tin bắt buộc.');
            setIsLoading(false);
            return;
        }

        const [startTime, endTime] = formValues.slot.split('-');

        const payload = {
            classField: {
                id: parseInt(formValues.classId),
            },
            dayOfWeek: formValues.dayOfWeek,
            date: formValues.date,
            startTime: startTime,
            endTime: endTime,
            topic: formValues.topic,
        };

        if (!payload.topic) {
            delete payload.topic;
        }

        try {
            if (mode === 'add') {
                await axios.post('/driving-school-management/schedules', payload);
            } else if (mode === 'edit') {
                if (!selectedSchedule || !selectedSchedule.id) {
                    setError('Lỗi: Không tìm thấy lịch học để cập nhật.');
                    setIsLoading(false);
                    return;
                }
                await axios.put(`/driving-school-management/schedules/${selectedSchedule.id}`, payload);
            }
            setMode('list');
            setFormValues({
                classId: '',
                dayOfWeek: '',
                date: '',
                slot: '',
                topic: '',
            });
            setError('');
            await handleFetchSchedules();
        } catch (err) {
            console.error('API Error:', err.response ? err.response.data : err.message);

            if (err.response) {
                if (err.response.status === 404) {
                    setError('Lỗi: Không tìm thấy lịch học hoặc ID lớp học không hợp lệ. Vui lòng kiểm tra lại.');
                } else if (err.response.status === 400) {
                    setError('Lỗi: Dữ liệu bạn gửi không hợp lệ. Vui lòng kiểm tra lại các trường thông tin.');
                } else {
                    setError(`Lỗi ${err.response.status}: ${err.response.data.message || 'Có lỗi xảy ra khi lưu lịch học.'}`);
                }
            } else {
                setError('Lỗi kết nối mạng hoặc server không phản hồi.');
            }
        } finally {
            setIsLoading(false);
        }
    };

    const handleBack = () => {
        setMode('list');
        setSelectedSchedule(null);
        setError('');
    };

    const dayLabels = ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY'];
    const timeSlots = [
        '07:00-08:30', '08:30-10:00', '10:00-11:30', '13:00-14:30',
        '14:30-16:00', '16:00-17:30', '17:30-19:00', '19:00-20:30',
    ];

    const renderScheduleTable = () => {
        const scheduleMap = {};
        filteredSchedules.forEach(schedule => {
            if (!scheduleMap[schedule.dayOfWeek]) {
                scheduleMap[schedule.dayOfWeek] = [];
            }
            scheduleMap[schedule.dayOfWeek].push(schedule);
        });

        return (
            <TableContainer component={Paper} sx={{ mt: 4 }}>
                <Table>
                    <TableHead>
                        <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
                            <TableCell>Slot</TableCell>
                            {dayLabels.map(day => <TableCell key={day}>{day}</TableCell>)}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {timeSlots.map(slot => {
                            const [start, end] = slot.split('-');
                            return (
                                <TableRow key={slot}>
                                    <TableCell>{`${start}-${end}`}</TableCell>
                                    {dayLabels.map(day => {
                                        const dailySchedules = scheduleMap[day] || [];
                                        const currentSlot = dailySchedules.find(s =>
                                            s.startTime.slice(0, 5) === start && s.endTime.slice(0, 5) === end
                                        );

                                        if (currentSlot) {
                                            return (
                                                <TableCell key={day}>
                                                    <Box sx={{
                                                        border: '1px solid #ccc',
                                                        borderRadius: '4px',
                                                        p: 1,
                                                        minHeight: '80px',
                                                        backgroundColor: '#e3f2fd',
                                                    }}>
                                                        <Typography variant="body2" sx={{ fontWeight: 'bold' }}>{currentSlot.topic}</Typography>
                                                        <Box sx={{ mt: 1 }}>
                                                            <Tooltip title="Xem chi tiết">
                                                                <IconButton size="small" onClick={() => handleViewDetails(currentSlot)}>
                                                                    <VisibilityIcon fontSize="small" color="info" />
                                                                </IconButton>
                                                            </Tooltip>
                                                            <Tooltip title="Chỉnh sửa">
                                                                <IconButton size="small" onClick={() => handleEditScheduleClick(currentSlot)}>
                                                                    <EditIcon fontSize="small" color="warning" />
                                                                </IconButton>
                                                            </Tooltip>
                                                        </Box>
                                                    </Box>
                                                </TableCell>
                                            );
                                        }
                                        return <TableCell key={day}>-</TableCell>;
                                    })}
                                </TableRow>
                            );
                        })}
                    </TableBody>
                </Table>
            </TableContainer>
        );
    };

    const renderContent = () => {
        if (isLoading) {
            return (
                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                    <CircularProgress />
                </Box>
            );
        }
        if (mode === 'list') {
            return (
                <>
                    <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', mb: 4 }}>
                        <TextField
                            label="Nhập ID Lớp Học"
                            variant="outlined"
                            value={classId}
                            onChange={(e) => setClassId(e.target.value)}
                            fullWidth
                            sx={{ flex: 1 }}
                        />
                        <Button
                            variant="contained"
                            onClick={handleFetchSchedules}
                            sx={{ height: '56px' }}
                            disabled={!classId}
                        >
                            Tìm Kiếm
                        </Button>
                        <Tooltip title="Thêm Lịch Học Mới">
                            <IconButton color="primary" sx={{ height: '56px' }} onClick={handleAddScheduleClick}>
                                <AddIcon />
                            </IconButton>
                        </Tooltip>
                    </Box>
                    {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
                    {schedules.length > 0 && (
                        <>
                            <Box sx={{ display: 'flex', gap: 2, mb: 4 }}>
                                <TextField
                                    label="Năm"
                                    variant="outlined"
                                    value={filterYear}
                                    onChange={(e) => setFilterYear(e.target.value)}
                                    fullWidth
                                    select
                                >
                                    {years.map(year => (
                                        <MenuItem key={year} value={year}>{year}</MenuItem>
                                    ))}
                                </TextField>
                                <TextField
                                    label="Tuần"
                                    variant="outlined"
                                    value={filterWeek}
                                    onChange={(e) => setFilterWeek(e.target.value)}
                                    fullWidth
                                    select
                                    disabled={!filterYear}
                                >
                                    {filterYear && weeksInYear(parseInt(filterYear)).map(week => (
                                        <MenuItem key={week.value} value={week.value}>{week.label}</MenuItem>
                                    ))}
                                </TextField>
                            </Box>
                            {renderScheduleTable()}
                        </>
                    )}
                </>
            );
        }
        if (mode === 'add' || mode === 'edit') {
            const title = mode === 'add' ? 'Thêm Lịch Học Mới' : `Sửa Lịch Học ID: ${selectedSchedule.id}`;
            return (
                <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                        <Typography variant="h5" gutterBottom>
                            {title}
                        </Typography>
                        <Tooltip title="Quay lại">
                            <IconButton onClick={handleBack}>
                                <ArrowBackIcon />
                            </IconButton>
                        </Tooltip>
                    </Box>
                    {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        label="ID Lớp Học"
                        name="classId"
                        type="number"
                        value={formValues.classId}
                        onChange={handleFormChange}
                        disabled={mode === 'edit'}
                    />
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        label="Ngày học"
                        name="date"
                        type="date"
                        InputLabelProps={{ shrink: true }}
                        value={formValues.date}
                        onChange={handleFormChange}
                    />
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        label="Ngày trong tuần"
                        name="dayOfWeek"
                        value={formValues.dayOfWeek}
                        onChange={handleFormChange}
                        disabled
                    />
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        label="Chọn Slot Thời Gian"
                        name="slot"
                        select
                        value={formValues.slot}
                        onChange={handleFormChange}
                    >
                        {timeSlots.map(slot => (
                            <MenuItem key={slot} value={slot}>
                                {slot}
                            </MenuItem>
                        ))}
                    </TextField>
                    <TextField
                        margin="normal"
                        fullWidth
                        label="Chủ đề"
                        name="topic"
                        value={formValues.topic}
                        onChange={handleFormChange}
                    />
                    <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>
                        Lưu
                    </Button>
                    <Button fullWidth variant="outlined" onClick={handleBack}>
                        Hủy
                    </Button>
                </Box>
            );
        }
        if (mode === 'details') {
            return (
                <Box component={Paper} sx={{ p: 4 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                        <Typography variant="h5" gutterBottom>
                            Thông Tin Chi Tiết Lịch Học
                        </Typography>
                        <Tooltip title="Quay lại">
                            <IconButton onClick={handleBack}>
                                <ArrowBackIcon />
                            </IconButton>
                        </Tooltip>
                    </Box>
                    <Typography variant="body1">
                        <strong>ID Lịch Học:</strong> {selectedSchedule.id}
                    </Typography>
                    <Typography variant="body1">
                        <strong>ID Lớp Học:</strong> {selectedSchedule.classId}
                    </Typography>
                    <Typography variant="body1">
                        <strong>Ngày trong tuần:</strong> {selectedSchedule.dayOfWeek}
                    </Typography>
                    <Typography variant="body1">
                        <strong>Ngày học:</strong> {selectedSchedule.date}
                    </Typography>
                    <Typography variant="body1">
                        <strong>Thời gian:</strong> {selectedSchedule.startTime} - {selectedSchedule.endTime}
                    </Typography>
                    <Typography variant="body1">
                        <strong>Chủ đề:</strong> {selectedSchedule.topic}
                    </Typography>
                    <Box sx={{ mt: 3 }}>
                        <Button variant="contained" onClick={() => handleEditScheduleClick(selectedSchedule)}>
                            Chỉnh Sửa
                        </Button>
                    </Box>
                </Box>
            );
        }
    };

    return (
        <Container component="main" maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
            <Typography component="h1" variant="h4" gutterBottom>
                Quản Lý Lịch Học
            </Typography>
            {renderContent()}
        </Container>
    );
};
export default ViewSchedule;
