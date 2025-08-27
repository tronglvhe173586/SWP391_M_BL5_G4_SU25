import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
    Container, Box, Typography, Table, TableContainer, TableHead, TableRow, TableCell, TableBody,
    Paper, Alert, CircularProgress, Tooltip, IconButton, TextField, MenuItem
} from '@mui/material';
import { Visibility as VisibilityIcon, ArrowBack as ArrowBackIcon } from '@mui/icons-material';
import { configuration } from '../configurations/configuration';
import { getToken } from '../services/localStorageService';

const LearnerClassSchedule = () => {
    const [schedules, setSchedules] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [selectedSchedule, setSelectedSchedule] = useState(null);
    const [mode, setMode] = useState('list');

    const [filterYear, setFilterYear] = useState('');
    const [filterWeek, setFilterWeek] = useState('');

    const dayLabels = ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY'];
    const timeSlots = [
        '07:00-08:30', '08:30-10:00', '10:00-11:30', '13:00-14:30',
        '14:30-16:00', '16:00-17:30', '17:30-19:00', '19:00-20:30',
    ];

    const getISOWeek = (date) => {
        const d = new Date(date);
        d.setHours(0, 0, 0, 0);
        d.setDate(d.getDate() + 4 - (d.getDay() || 7));
        const yearStart = new Date(d.getFullYear(), 0, 1);
        const weekNo = Math.ceil((((d - yearStart) / 86400000) + 1) / 7);
        return weekNo;
    };

    const formatDate = (date) => {
        const d = new Date(date);
        const day = d.getDate().toString().padStart(2, '0');
        const month = (d.getMonth() + 1).toString().padStart(2, '0');
        return `${day}/${month}`;
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

            if (endOfWeek.getFullYear() > year && getISOWeek(endOfWeek) === 1) {
                break;
            }

            weeks.push({
                value: weekNumber.toString(),
                label: `Tuần ${weekNumber} (${formatDate(startOfWeek)} - ${formatDate(endOfWeek)})`
            });

            weekNumber++;
            d.setDate(d.getDate() + 7);
        }
        return weeks;
    };

    const fetchAllSchedules = async () => {
        setIsLoading(true);
        setError('');
        try {
            const token = getToken();
            const response = await axios.get(`${configuration.API_BASE_URL}/schedules/learner/my-schedules`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setSchedules(response.data);

            if (response.data && response.data.length > 0) {
                const now = new Date();
                setFilterYear(now.getFullYear().toString());
                setFilterWeek(getISOWeek(now).toString());
            } else {
                setFilterYear('');
                setFilterWeek('');
            }

        } catch (err) {
            console.error('API Error:', err.response ? err.response.data : err.message);
            setError(err?.response?.data?.message || 'Lỗi khi tải lịch học của bạn.');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (mode === 'list') {
            fetchAllSchedules();
        }
    }, [mode]);

    const handleViewDetails = (schedule) => {
        setSelectedSchedule(schedule);
        setMode('details');
    };

    const handleBack = () => {
        setSelectedSchedule(null);
        setMode('list');
    };

    const renderScheduleTable = () => {
        let filteredSchedules = schedules;

        if (filterYear) {
            filteredSchedules = filteredSchedules.filter(schedule => {
                const scheduleYear = new Date(schedule.date).getFullYear();
                return scheduleYear.toString() === filterYear;
            });
        }

        if (filterWeek && filterYear) {
            filteredSchedules = filteredSchedules.filter(schedule => {
                const weekOfYear = getISOWeek(new Date(schedule.date));
                return weekOfYear.toString() === filterWeek;
            });
        }

        const scheduleMap = {};
        filteredSchedules.forEach(schedule => {
            const timeKey = `${schedule.startTime.slice(0, 5)}-${schedule.endTime.slice(0, 5)}`;
            if (!scheduleMap[schedule.dayOfWeek]) {
                scheduleMap[schedule.dayOfWeek] = {};
            }
            scheduleMap[schedule.dayOfWeek][timeKey] = schedule;
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
                        {timeSlots.map(slot => (
                            <TableRow key={slot}>
                                <TableCell>{slot}</TableCell>
                                {dayLabels.map(day => {
                                    const scheduleSlot = scheduleMap[day] && scheduleMap[day][slot];
                                    return (
                                        <TableCell key={day}>
                                            {scheduleSlot ? (
                                                <Box sx={{
                                                    border: '1px solid #ccc',
                                                    borderRadius: '4px',
                                                    p: 1,
                                                    minHeight: '80px',
                                                    backgroundColor: '#e3f2fd',
                                                    display: 'flex',
                                                    flexDirection: 'column',
                                                    justifyContent: 'space-between'
                                                }}>
                                                    <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                                                        {scheduleSlot.topic}
                                                    </Typography>
                                                    <Box sx={{ mt: 1, display: 'flex', justifyContent: 'flex-end' }}>
                                                        <Tooltip title="Xem chi tiết">
                                                            <IconButton size="small" onClick={() => handleViewDetails(scheduleSlot)}>
                                                                <VisibilityIcon fontSize="small" color="info" />
                                                            </IconButton>
                                                        </Tooltip>
                                                    </Box>
                                                </Box>
                                            ) : (
                                                <Typography variant="body2" color="text.secondary">
                                                    -
                                                </Typography>
                                            )}
                                        </TableCell>
                                    );
                                })}
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        );
    };

    const renderDetailsView = () => (
        <Box component={Paper} sx={{ p: 4, mt: 4 }}>
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
        </Box>
    );

    return (
        <Container component="main" maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
            <Typography component="h1" variant="h4" gutterBottom>
                Lịch học của tôi
            </Typography>
            {isLoading && (
                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                    <CircularProgress />
                </Box>
            )}
            {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
            {!isLoading && !error && mode === 'list' && (
                <>
                    {schedules.length > 0 && (
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
                    )}
                    {schedules.length > 0 ? renderScheduleTable() : (
                        <Alert severity="info" sx={{ mt: 2 }}>
                            Bạn chưa có lịch học nào.
                        </Alert>
                    )}
                </>
            )}
            {!isLoading && mode === 'details' && selectedSchedule && renderDetailsView()}
        </Container>
    );
};

export default LearnerClassSchedule;