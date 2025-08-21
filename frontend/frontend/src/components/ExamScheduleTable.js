import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { DataGrid } from '@mui/x-data-grid';
import {Paper, TextField, Box, Container, Typography, Button, Tooltip, IconButton} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { viVN } from '@mui/x-data-grid/locales';
import { configuration } from '../configurations/configuration';
import EditIcon from "@mui/icons-material/Edit";


const ExamScheduleTable = () => {
    const [examSchedules, setExamSchedules] = useState([]);
    const [loading, setLoading] = useState(false);
    const [keyword, setKeyword] = useState('');
    const navigate = useNavigate();

    const columns = [
        { field: 'id', headerName: 'ID', width: 70 },
        { field: 'examName', headerName: 'Tên kỳ thi', width: 200 },
        { field: 'className', headerName: 'Lớp', width: 160 },
        { field: 'examDate', headerName: 'Ngày thi', width: 140 },
        { field: 'startTime', headerName: 'Giờ bắt đầu', width: 140 },
        { field: 'location', headerName: 'Địa điểm', width: 240 },
        {
            field: 'actions',
            headerName: 'Sửa',
            width: 80,
            renderCell: (params) => (
                <Tooltip title={"Sửa"}>
                    <IconButton
                        color={"warning"}
                        size={"small"}
                        onClick={() => navigate(`/exam-schedules/edit/${params.row.id}`)}
                    >
                        <EditIcon></EditIcon>
                    </IconButton>
                </Tooltip>

            )
        }
    ];

    const fetchExamSchedules = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem('jwtToken');
            const response = await axios.get(
                `${configuration.API_BASE_URL}/exam-schedules`,
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setExamSchedules(response.data.result || []);
        } catch (err) {
            console.error('Lỗi khi lấy danh sách lịch thi:', err);
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchExamSchedules();
    }, []);

    const filteredRows = examSchedules.filter((s) => {
        const q = keyword.toLowerCase();
        return (
            (s.examName || '').toLowerCase().includes(q) ||
            (s.className || '').toLowerCase().includes(q) ||
            (s.location || '').toLowerCase().includes(q) ||
            (s.instructorName || '').toLowerCase().includes(q) ||
            (String(s.maxParticipants || '')).includes(q) ||
            (s.examDate || '').toLowerCase().includes(q) ||
            (s.startTime || '').toLowerCase().includes(q)
        );
    });

    const handleAddExamSchedule = () => {
        navigate('/exam-schedules/add');
    };

    return (
        <Container maxWidth="lg" sx={{ mt: 4 }}>
            <Typography variant="h4" gutterBottom>
                Quản lý lịch thi
            </Typography>
            <Paper sx={{ height: 500, width: '100%' }}>
                <Box sx={{ p: 2 }}>
                    <TextField
                        label="Tìm kiếm"
                        variant="outlined"
                        size="small"
                        value={keyword}
                        onChange={(e) => setKeyword(e.target.value)}
                        fullWidth
                    />
                </Box>
                <DataGrid
                    rows={filteredRows}
                    columns={columns}
                    pageSizeOptions={[10, 20]}
                    initialState={{
                        pagination: { paginationModel: { page: 0, pageSize: 10 } },
                    }}
                    loading={loading}
                    disableRowSelectionOnClick
                    localeText={viVN.components.MuiDataGrid.defaultProps.localeText}
                />
            </Paper>
            <Button
                variant="contained"
                color="success"
                sx={{ mt: 2 }}
                onClick={handleAddExamSchedule}
            >
                Tạo lịch thi
            </Button>
        </Container>
    );
};

export default ExamScheduleTable;
