import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, Link } from 'react-router-dom';
import { Container, Typography, Button, Box, Paper } from '@mui/material';
import PeopleIcon from '@mui/icons-material/People';

const ViewClass = () => {
  const { id } = useParams();
  const [classData, setClassData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchClass = async () => {
      try {
        const token = localStorage.getItem('jwtToken');
        const response = await axios.get(`http://localhost:8080/driving-school-management/classes/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setClassData(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Lỗi khi tải dữ liệu lớp học:', error);
        alert('Không thể tải dữ liệu lớp học');
      }
    };

    fetchClass();
  }, [id]);

  if (loading) return <Typography>Đang tải...</Typography>;

  return (
      <Container>
        <Paper elevation={3} sx={{ p: 3, mt: 3 }}>
          <h2>Xem Lớp Học</h2>
          <Typography>ID: {classData.classId}</Typography>
          <Typography>Tên Lớp: {classData.className}</Typography>
          <Typography>Ngày Bắt Đầu: {classData.startDate}</Typography>
          <Typography>Ngày Kết Thúc: {classData.endDate}</Typography>
          <Typography>Sĩ Số Tối Đa: {classData.maxStudents}</Typography>
          <Typography>Giảng Viên: {classData.instructorName}</Typography>
          <Typography>Số Học Viên Hiện Tại: {classData.currentStudentsCount}</Typography>

          <Box sx={{ mt: 3 }}>
            <Button
                component={Link}
                to={`/enrollments?classId=${id}`}
                variant="contained"
                color="primary"
                startIcon={<PeopleIcon />}
            >
              Xem Học Viên
            </Button>
          </Box>
        </Paper>
      </Container>
  );
};

export default ViewClass;