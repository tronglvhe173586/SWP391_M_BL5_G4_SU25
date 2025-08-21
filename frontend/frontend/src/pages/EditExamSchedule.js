import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { configuration } from '../configurations/configuration';
import { Container, Paper, Typography, Box, TextField, Button, Alert, Grid } from '@mui/material';

const EditExamSchedule = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [form, setForm] = useState({
    examName: '',
    className: '',
    instructorName: '',
    examDate: '',
    startTime: '',
    location: '',
    maxParticipants: ''
  });

  useEffect(() => {
    const fetchDetail = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('jwtToken');
        const res = await axios.get(`${configuration.API_BASE_URL}/exam-schedules/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const s = res.data.result || {};
        setForm({
          examName: s.examName || '',
          className: s.className || '',
          instructorName: s.instructorName || '',
          examDate: s.examDate || '',
          startTime: s.startTime || '',
          location: s.location || '',
          maxParticipants: s.maxParticipants ?? ''
        });
      } catch (e) {
        console.error('Failed to load exam schedule', e);
        setError('Không thể tải chi tiết lịch thi');
      } finally {
        setLoading(false);
      }
    };
    fetchDetail();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);
    try {
      const token = localStorage.getItem('jwtToken');
      await axios.put(
        `${configuration.API_BASE_URL}/exam-schedules/${id}`,
        {
          examDate: form.examDate,
          startTime: form.startTime,
          location: form.location || null,
          maxParticipants: form.maxParticipants === '' ? null : Number(form.maxParticipants)
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setSuccess('Cập nhật lịch thi thành công');
      setTimeout(() => navigate('/exam-schedules'), 1200);
    } catch (e) {
      console.error('Failed to update exam schedule', e);
      setError(e.response?.data?.message || 'Cập nhật thất bại');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => navigate('/exam-schedules');

  return (
    <Container maxWidth="sm" sx={{ mt: 4, mb: 4 }}>
      <Paper sx={{ p: 4 }}>
        <Typography variant="h4" gutterBottom align="center" sx={{ fontWeight: 'bold', color: 'black' }}>
          Sửa Lịch Thi
        </Typography>
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField fullWidth label="Kỳ thi" value={form.examName} InputProps={{ readOnly: true }} />
            </Grid>
            <Grid item xs={12}>
              <TextField fullWidth label="Lớp học" value={form.className} InputProps={{ readOnly: true }} />
            </Grid>
            <Grid item xs={12}>
              <TextField fullWidth label="Giảng viên" value={form.instructorName} InputProps={{ readOnly: true }} />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Ngày thi *"
                name="examDate"
                type="date"
                value={form.examDate}
                onChange={handleChange}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Giờ bắt đầu *"
                name="startTime"
                type="time"
                value={form.startTime}
                onChange={handleChange}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField fullWidth label="Địa điểm" name="location" value={form.location} onChange={handleChange} />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Số lượng tối đa"
                name="maxParticipants"
                type="number"
                value={form.maxParticipants}
                onChange={handleChange}
                inputProps={{ min: 1 }}
              />
            </Grid>
          </Grid>

          <Box sx={{ mt: 4, display: 'flex', flexDirection: 'column', gap: 2, alignItems: 'center' }}>
            <Button type="submit" variant="contained" color="primary" disabled={loading || !form.examDate || !form.startTime} fullWidth>
              {loading ? 'Đang lưu...' : 'LƯU'}
            </Button>
            <Button type="button" variant="outlined" onClick={handleCancel} disabled={loading} fullWidth>
              HỦY
            </Button>
          </Box>
        </Box>
      </Paper>
    </Container>
  );
};

export default EditExamSchedule;


