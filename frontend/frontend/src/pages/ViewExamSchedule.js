import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { configuration } from '../configurations/configuration';
import {
  Container,
  Paper,
  Typography,
  Box,
  Button,
  Grid,
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Icon,
  Alert
} from '@mui/material';
import {
  School as SchoolIcon,
  Class as ClassIcon,
  Person as PersonIcon,
  CalendarToday as CalendarIcon,
  AccessTime as TimeIcon,
  LocationOn as LocationIcon,
  Group as GroupIcon,
  ArrowBack as ArrowBackIcon
} from '@mui/icons-material';

const ViewExamSchedule = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [examSchedule, setExamSchedule] = useState(null);

  useEffect(() => {
    const fetchExamScheduleDetail = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('jwtToken');
        const response = await axios.get(
          `${configuration.API_BASE_URL}/exam-schedules/${id}/detail`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setExamSchedule(response.data.result);
      } catch (err) {
        console.error('Error fetching exam schedule details:', err);
        setError('Không thể tải chi tiết lịch thi');
      } finally {
        setLoading(false);
      }
    };

    fetchExamScheduleDetail();
  }, [id]);

  const handleBack = () => navigate('/exam-schedules');

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Typography>Đang tải...</Typography>
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Alert severity="error">{error}</Alert>
        <Button onClick={handleBack} sx={{ mt: 2 }}>Quay lại</Button>
      </Container>
    );
  }

  if (!examSchedule) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Typography>Không tìm thấy lịch thi</Typography>
        <Button onClick={handleBack} sx={{ mt: 2 }}>Quay lại</Button>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      {/* Exam Schedule Information Card */}
      <Paper sx={{ p: 4, mb: 4 }}>
        <Typography variant="h4" gutterBottom align="center" sx={{ fontWeight: 'bold', color: 'black', mb: 4 }}>
          Thông tin Lịch Thi
        </Typography>

        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <SchoolIcon sx={{ color: 'primary.main', mr: 2, fontSize: 28 }} />
              <Box>
                <Typography variant="body2" color="text.secondary">Kỳ thi</Typography>
                <Typography variant="h6" fontWeight="bold">
                  {examSchedule.examName || 'Không có thông tin'}
                </Typography>
              </Box>
            </Box>
          </Grid>

          <Grid item xs={12} md={6}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <ClassIcon sx={{ color: 'secondary.main', mr: 2, fontSize: 28 }} />
              <Box>
                <Typography variant="body2" color="text.secondary">Lớp học</Typography>
                <Typography variant="h6" fontWeight="bold">
                  {examSchedule.className || 'Không có lớp'}
                </Typography>
              </Box>
            </Box>
          </Grid>

          <Grid item xs={12} md={6}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <PersonIcon sx={{ color: 'success.main', mr: 2, fontSize: 28 }} />
              <Box>
                <Typography variant="body2" color="text.secondary">Giảng viên</Typography>
                <Typography variant="h6" fontWeight="bold">
                  {examSchedule.instructorName || 'Không có giảng viên'}
                </Typography>
              </Box>
            </Box>
          </Grid>

          <Grid item xs={12} md={6}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <CalendarIcon sx={{ color: 'info.main', mr: 2, fontSize: 28 }} />
              <Box>
                <Typography variant="body2" color="text.secondary">Ngày thi</Typography>
                <Typography variant="h6" fontWeight="bold">
                  {examSchedule.examDate ? new Date(examSchedule.examDate).toLocaleDateString('vi-VN') : 'Chưa có ngày'}
                </Typography>
              </Box>
            </Box>
          </Grid>

          <Grid item xs={12} md={6}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <TimeIcon sx={{ color: 'warning.main', mr: 2, fontSize: 28 }} />
              <Box>
                <Typography variant="body2" color="text.secondary">Giờ bắt đầu</Typography>
                <Typography variant="h6" fontWeight="bold">
                  {examSchedule.startTime || 'Chưa có giờ'}
                </Typography>
              </Box>
            </Box>
          </Grid>

          <Grid item xs={12} md={6}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <LocationIcon sx={{ color: 'error.main', mr: 2, fontSize: 28 }} />
              <Box>
                <Typography variant="body2" color="text.secondary">Địa điểm</Typography>
                <Typography variant="h6" fontWeight="bold">
                  {examSchedule.location || 'Chưa có địa điểm'}
                </Typography>
              </Box>
            </Box>
          </Grid>

          <Grid item xs={12} md={6}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <GroupIcon sx={{ color: 'primary.main', mr: 2, fontSize: 28 }} />
              <Box>
                <Typography variant="body2" color="text.secondary">Số lượng tối đa</Typography>
                <Typography variant="h6" fontWeight="bold">
                  {examSchedule.maxParticipants ? `${examSchedule.maxParticipants} người` : 'Không giới hạn'}
                </Typography>
              </Box>
            </Box>
          </Grid>
        </Grid>

        <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center' }}>
          <Button
            variant="contained"
            color="primary"
            onClick={handleBack}
            startIcon={<ArrowBackIcon />}
            sx={{
              py: 1.5,
              px: 4,
              textTransform: 'uppercase',
              fontWeight: 'bold'
            }}
          >
            QUAY LẠI DANH SÁCH
          </Button>
        </Box>
      </Paper>

      {/* Learners Section */}
      {examSchedule.learners && examSchedule.learners.length > 0 && (
        <Paper sx={{ p: 4 }}>
          <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold', color: 'black', mb: 3 }}>
            Danh sách Học viên
          </Typography>

          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontWeight: 'bold' }}>STT</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Họ và tên</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Email</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Số điện thoại</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Trạng thái</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {examSchedule.learners.map((learner, index) => (
                  <TableRow key={learner.id}>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell>
                      <Typography variant="body1" fontWeight="medium">
                        {learner.firstName} {learner.lastName}
                      </Typography>
                    </TableCell>
                    <TableCell>{learner.email}</TableCell>
                    <TableCell>{learner.phone || 'Không có'}</TableCell>
                    <TableCell>
                      <Chip
                        label={learner.status}
                        color={learner.status === 'ENROLLED' ? 'success' : 'default'}
                        size="small"
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      )}

      {(!examSchedule.learners || examSchedule.learners.length === 0) && (
        <Paper sx={{ p: 4, textAlign: 'center' }}>
          <Typography variant="h6" color="text.secondary">
            Không có học viên nào trong lớp này
          </Typography>
        </Paper>
      )}
    </Container>
  );
};

export default ViewExamSchedule;
