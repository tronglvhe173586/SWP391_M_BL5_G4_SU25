import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Container, Typography, Paper, Box, Button, TextField, MenuItem, CircularProgress } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { viVN } from '@mui/x-data-grid/locales';

const ExamRegistration = () => {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);
  const [learners, setLearners] = useState([]);
  const [selectedLearnerId, setSelectedLearnerId] = useState('');
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
        const isDisabled = Boolean(status) || !selectedLearnerId || isRegistering;
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
      const list = resp.data.result || [];
      setRows(list);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const fetchUsersAndFilterLearners = async () => {
    try {
      const resp = await axios.get(`/driving-school-management/users`);
      const allUsers = resp.data || [];
      const learnerList = allUsers.filter(user => user.role === 'LEARNER');
      setLearners(learnerList);
    } catch (e) {
      console.error(e);
    }
  };

  const fetchRegistrationStatus = async (learnerId, scheduleIds) => {
    if (!learnerId || scheduleIds.length === 0) {
      setRegistrationStatus({});
      return;
    }
    try {
      const qs = encodeURIComponent(scheduleIds.join(','));
      const resp = await axios.get(`/driving-school-management/exam-registrations/statuses?learnerId=${learnerId}&examScheduleIds=${qs}`);
      setRegistrationStatus(resp?.data?.result || {});
    } catch (e) {
      console.error("Lỗi khi lấy trạng thái đăng ký:", e);
    }
  };

  const handleRegister = async (scheduleId) => {
    if (!selectedLearnerId) {
      alert('Vui lòng chọn một học viên.');
      return;
    }
    setIsRegistering(true);
    try {
      await axios.post(`/driving-school-management/exam-registrations`, {
        examScheduleId: scheduleId,
        learnerId: selectedLearnerId,
      });
      alert('Đăng ký thành công!');
      setRegistrationStatus(prevStatus => ({
        ...prevStatus,
        [scheduleId]: 'PENDING'
      }));
    } catch (e) {
      const msg = e?.response?.data?.message || 'Đăng ký thất bại';
      alert(msg);
    } finally {
      setIsRegistering(false);
    }
  };

  useEffect(() => {
    fetchSchedules();
    fetchUsersAndFilterLearners();
  }, []);

  useEffect(() => {
    if (selectedLearnerId && rows.length > 0) {
      const scheduleIds = rows.map(row => row.id);
      fetchRegistrationStatus(selectedLearnerId, scheduleIds);
    } else {
      setRegistrationStatus({});
    }
  }, [selectedLearnerId, rows]);

  return (
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Typography variant="h4" gutterBottom>
          Đăng ký thi cho học viên
        </Typography>

        <Paper sx={{ p: 2, mb: 3 }}>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
            Chọn học viên để đăng ký thi:
          </Typography>
          <TextField
              select
              label="Học viên"
              value={selectedLearnerId}
              onChange={(e) => setSelectedLearnerId(e.target.value)}
              fullWidth
          >
            <MenuItem value="">
              <em>Chọn một học viên</em>
            </MenuItem>
            {learners.length > 0 ? (
                learners.map((learner) => (
                    <MenuItem key={learner.id} value={learner.id}>
                      {learner.firstName} {learner.lastName}
                    </MenuItem>
                ))
            ) : (
                <MenuItem disabled>Không có học viên nào</MenuItem>
            )}
          </TextField>
        </Paper>

        <Paper sx={{ height: 520, width: '100%' }}>
          <Box sx={{ p: 2 }}>
            <Typography variant="body2" color="text.secondary">
              Chọn lịch thi và nhấn Đăng ký cho học viên đã chọn.
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