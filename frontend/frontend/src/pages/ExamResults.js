import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { DataGrid } from '@mui/x-data-grid';
import {
    Paper,
    TextField,
    Box,
    Container,
    Typography,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Chip,
    Alert,
    Button, Tooltip, IconButton
} from '@mui/material';
import { viVN } from '@mui/x-data-grid/locales';
import { configuration } from '../configurations/configuration';
import { useNavigate } from 'react-router-dom';
import EditIcon from "@mui/icons-material/Edit";
import AddIcon from "@mui/icons-material/Add";

const ExamResults = () => {
    const [examResults, setExamResults] = useState([]);
    const [examSchedules, setExamSchedules] = useState([]);
    const [loading, setLoading] = useState(false);
    const [keyword, setKeyword] = useState('');
    const [selectedExamSchedule, setSelectedExamSchedule] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const columns = [
        { field: 'id', headerName: 'ID', width: 70 },
        { field: 'learnerName', headerName: 'Tên học viên', width: 180 },
        { field: 'learnerEmail', headerName: 'Email', width: 200 },
        { field: 'examName', headerName: 'Tên kỳ thi', width: 180 },
        { field: 'className', headerName: 'Lớp', width: 140 },
        { field: 'examDate', headerName: 'Ngày thi', width: 120 },
        { field: 'location', headerName: 'Địa điểm', width: 150 },
        { field: 'instructorName', headerName: 'Giảng viên', width: 150 },
        { 
            field: 'score', 
            headerName: 'Điểm', 
            width: 100,
            renderCell: (params) => (
                <Box>
                    {params.value ? (
                        <Chip 
                            label={params.value} 
                            color={params.row.isPassed ? 'success' : 'error'}
                            variant="outlined"
                        />
                    ) : (
                        <Chip label="N/A" color="default" variant="outlined" />
                    )}
                </Box>
            )
        },
        { 
            field: 'passScore', 
            headerName: 'Điểm đạt', 
            width: 100,
            renderCell: (params) => (
                <Typography variant="body2">
                    {params.value || 'N/A'}
                </Typography>
            )
        },
        { 
            field: 'isPassed', 
            headerName: 'Kết quả', 
            width: 100,
            renderCell: (params) => {
                if (params.value === null) return <Chip label="Chưa có kết quả" color="default" />;
                return params.value ? 
                    <Chip label="Đạt" color="success" /> : 
                    <Chip label="Không đạt" color="error" />;
            }
        },
        {
            field: "actions",
            headerName: "Sửa",
            width: 80,
            renderCell: (params) => (
                <Tooltip title="Sửa">
                    <IconButton
                        color="warning"
                        size="small"
                        onClick={() => navigate(`/exam-results/edit/${params.row.id}`)}
                    >
                        <EditIcon />
                    </IconButton>
                </Tooltip>
            ),
        }
    ];

    const fetchExamSchedules = async () => {
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
    };

    const fetchExamResults = async () => {
        setLoading(true);
        setError('');
        try {
            const token = localStorage.getItem('jwtToken');
            let url = `${configuration.API_BASE_URL}/exam-results`;
            
            if (selectedExamSchedule) {
                url = `${configuration.API_BASE_URL}/exam-results/exam-schedule/${selectedExamSchedule}`;
            }
            
            const response = await axios.get(url, { 
                headers: { Authorization: `Bearer ${token}` } 
            });
            setExamResults(response.data.result || []);
        } catch (err) {
            console.error('Lỗi khi lấy kết quả thi:', err);
            setError('Không thể tải dữ liệu kết quả thi. Vui lòng thử lại.');
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchExamSchedules();
    }, []);

    useEffect(() => {
        fetchExamResults();
    }, [selectedExamSchedule]);

    const filteredRows = examResults.filter((result) => {
        const q = keyword.toLowerCase();
        return (
            (result.learnerName || '').toLowerCase().includes(q) ||
            (result.learnerEmail || '').toLowerCase().includes(q) ||
            (result.examName || '').toLowerCase().includes(q) ||
            (result.className || '').toLowerCase().includes(q) ||
            (result.location || '').toLowerCase().includes(q) ||
            (result.instructorName || '').toLowerCase().includes(q)
        );
    });

    const handleExamScheduleChange = (event) => {
        setSelectedExamSchedule(event.target.value);
    };

    return (
        <Container maxWidth="xl" sx={{ mt: 4 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h4">
                    Kết quả thi
                </Typography>
                <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={() => navigate('/exam-results/add')}
                >
                    Thêm kết quả
                </Button>
            </Box>
            
            {error && (
                <Alert severity="error" sx={{ mb: 2 }}>
                    {error}
                </Alert>
            )}

            <Paper sx={{ p: 3, mb: 3 }}>
                <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', mb: 2 }}>
                    <FormControl sx={{ minWidth: 300 }}>
                        <InputLabel>Lọc theo lịch thi</InputLabel>
                        <Select
                            value={selectedExamSchedule}
                            label="Lọc theo lịch thi"
                            onChange={handleExamScheduleChange}
                        >
                            <MenuItem value="">
                                <em>Tất cả lịch thi</em>
                            </MenuItem>
                            {examSchedules.map((schedule) => (
                                <MenuItem key={schedule.id} value={schedule.id}>
                                    {schedule.examName} - {schedule.examDate} - {schedule.className || 'N/A'}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                    
                    <TextField
                        label="Tìm kiếm"
                        variant="outlined"
                        size="small"
                        value={keyword}
                        onChange={(e) => setKeyword(e.target.value)}
                        sx={{ minWidth: 300 }}
                        placeholder="Tìm theo tên, email, lớp, địa điểm..."
                    />
                </Box>
                
                <Typography variant="body2" color="text.secondary">
                    {selectedExamSchedule ? 
                        `Hiển thị kết quả cho lịch thi đã chọn (${filteredRows.length} kết quả)` :
                        `Hiển thị tất cả kết quả thi (${filteredRows.length} kết quả)`
                    }
                </Typography>
            </Paper>

            <Paper sx={{ height: 600, width: '100%' }}>
                <DataGrid
                    rows={filteredRows}
                    columns={columns}
                    pageSizeOptions={[10, 25, 50]}
                    initialState={{
                        pagination: {
                            paginationModel: { page: 0, pageSize: 25 },
                        },
                    }}
                    loading={loading}
                    disableRowSelectionOnClick
                    localeText={viVN.components.MuiDataGrid.defaultProps.localeText}
                    getRowClassName={(params) => {
                        if (params.row.isPassed === null) return 'no-result';
                        return params.row.isPassed ? 'passed' : 'failed';
                    }}
                />
            </Paper>
        </Container>
    );
};

export default ExamResults;
