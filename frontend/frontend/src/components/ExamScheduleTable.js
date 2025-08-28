import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { DataGrid } from '@mui/x-data-grid';
import {Paper, TextField, Box, Container, Typography, Button, ButtonGroup, Tooltip, IconButton} from '@mui/material';
import { viVN } from '@mui/x-data-grid/locales';
import { configuration } from '../configurations/configuration';
import { useNavigate } from 'react-router-dom';
import VisibilityIcon from "@mui/icons-material/Visibility";
import EditIcon from "@mui/icons-material/Edit";
import { Link } from "react-router-dom";

const ExamScheduleTable = () => {
    const [examSchedules, setExamSchedules] = useState([]);
    const [loading, setLoading] = useState(false);
    const [keyword, setKeyword] = useState('');
    const [page, setPage] = useState(0);
    const [pageSize, setPageSize] = useState(10);
    const [totalElements, setTotalElements] = useState(0);
    const navigate = useNavigate();

    const columns = [
        { field: 'id', headerName: 'ID', width: 70 },
        { field: 'examName', headerName: 'Tên kỳ thi', width: 200 },
        { field: 'className', headerName: 'Lớp', width: 160 },
        { field: 'examDate', headerName: 'Ngày thi', width: 140 },
        { field: 'startTime', headerName: 'Giờ bắt đầu', width: 140 },
        { field: 'location', headerName: 'Địa điểm', width: 180 },
        {
            field: 'view',
            headerName: 'Chi tiết',
            width: 80,
            renderCell: (params) => (
                <Tooltip title={"Xem chi tiết"}>
                    <IconButton
                        color={"primary"}
                        size={"small"}
                        onClick={() => navigate(`/exam-schedules/${params.row.id}`)}
                    >
                        <VisibilityIcon></VisibilityIcon>
                    </IconButton>
                </Tooltip>
            )
        },
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
                `${configuration.API_BASE_URL}/exam-schedules/pagination`,
                { 
                    params: {
                        page: page,
                        size: pageSize,
                        keyword: keyword,
                    },
                    headers: { Authorization: `Bearer ${token}` } 
                }
            );
            setExamSchedules(response.data.result.content || []);
            setTotalElements(response.data.result.totalElements || 0);
        } catch (err) {
            console.error('Lỗi khi lấy danh sách lịch thi:', err);
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchExamSchedules();
    }, [page, pageSize, keyword]);

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
                    rows={examSchedules}
                    columns={columns}
                    paginationMode="server"
                    rowCount={totalElements}
                    pageSizeOptions={[10, 20, 50]}
                    paginationModel={{ page, pageSize }}
                    onPaginationModelChange={(model) => {
                        setPage(model.page);
                        setPageSize(model.pageSize);
                    }}
                    loading={loading}
                    disableRowSelectionOnClick
                    localeText={viVN.components.MuiDataGrid.defaultProps.localeText}
                />
            </Paper>
            <Link to={"/exam-schedules/add"}>
                <Button variant="contained" color="success" sx={{ mt: 10 }}>
                    Tạo lịch thi
                </Button>
            </Link>

        </Container>
    );
};

export default ExamScheduleTable;
