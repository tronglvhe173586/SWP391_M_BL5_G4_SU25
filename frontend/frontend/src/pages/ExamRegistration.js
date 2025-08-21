import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Container, Typography, Paper, Box, Button } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { viVN } from '@mui/x-data-grid/locales';
import { configuration } from '../configurations/configuration';

const ExamRegistration = () => {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);

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
      headerName: 'Thao tác',
      width: 160,
      sortable: false,
      renderCell: (params) => (
        <Button variant="contained" onClick={() => handleRegister(params.row.id)}>
          Đăng ký
        </Button>
      ),
    },
  ];

  const fetchSchedules = async () => {
    setLoading(true);
    try {
      const resp = await axios.get(`${configuration.API_BASE_URL}/exam-schedules`);
      setRows(resp.data.result || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (scheduleId) => {
    try {
      await axios.post(`${configuration.API_BASE_URL}/exam-registrations`, {
        examScheduleId: scheduleId,
      });
      alert('Đăng ký thành công');
    } catch (e) {
      const msg = e?.response?.data?.message || 'Đăng ký thất bại';
      alert(msg);
    }
  };

  useEffect(() => {
    fetchSchedules();
  }, []);

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        Đăng ký thi
      </Typography>
      <Paper sx={{ height: 520, width: '100%' }}>
        <Box sx={{ p: 2 }}>
          <Typography variant="body2" color="text.secondary">
            Chọn lịch thi và nhấn Đăng ký.
          </Typography>
        </Box>
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


