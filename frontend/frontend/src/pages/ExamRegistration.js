import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Container, Typography, Paper, Box, Button } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { viVN } from '@mui/x-data-grid/locales';

const ExamRegistration = () => {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);
  const [statusByScheduleId, setStatusByScheduleId] = useState({});

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
        const status = statusByScheduleId[params.row.id];
        const label = getStatusLabel(status);
        return (
          <Button
            variant="contained"
            disabled={Boolean(status)}
            onClick={() => handleRegister(params.row.id)}
          >
            {label}
          </Button>
        );
      },
    },
  ];

  const fetchStatuses = async (ids) => {
    if (!ids || ids.length === 0) {
      setStatusByScheduleId({});
      return;
    }
    try {
      const qs = encodeURIComponent(ids.join(','));
      const resp = await axios.get(`/driving-school-management/exam-registrations/statuses?examScheduleIds=${qs}`);
      setStatusByScheduleId(resp?.data?.result || {});
    } catch (e) {
      // ignore status load errors
    }
  };

  const fetchSchedules = async () => {
    setLoading(true);
    try {
      const resp = await axios.get(`/driving-school-management/exam-schedules`);
      const list = resp.data.result || [];
      setRows(list);
      const ids = list.map((x) => x.id);
      fetchStatuses(ids);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (scheduleId) => {
    try {
      await axios.post(`/driving-school-management/exam-registrations`, {
        examScheduleId: scheduleId,
      });
      // Reload only the status for this schedule
      fetchStatuses([scheduleId]);
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


