import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, Link } from 'react-router-dom';
import { Container, Typography, Button, Box, Paper } from '@mui/material';
import PeopleIcon from '@mui/icons-material/People';
import { useNavigate } from 'react-router-dom';

const ViewLearner = () => {
  const { id } = useParams();
  const [learnerData, setLearnerData] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();  // Initialized navigate

  useEffect(() => {
    const fetchLearner = async () => {
      try {
        const token = localStorage.getItem('jwtToken');
        const response = await axios.get(`http://localhost:8080/driving-school-management/enrollments/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setLearnerData(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching learner:', error);
        alert('Không thể tải dữ liệu học viên');
      }
    };

    fetchLearner();
  }, [id]);

  if (loading) return <Typography>Loading...</Typography>;

  return (
      <Container>
        <Paper elevation={3} sx={{ p: 3, mt: 3 }}>
          <h2>Xem Học Viên</h2>
          <Typography>ID: {learnerData.id}</Typography>
          <Typography>Tên Học Viên: {learnerData.learnerName}</Typography>
          <Typography>Tên Lớp: {learnerData.className}</Typography>
          <Typography>Ngày Đăng Ký: {learnerData.enrollmentDate}</Typography>
          <Typography>Trạng Thái: {learnerData.status}</Typography>

          <Box sx={{ mt: 3 }}>
            <Button
                component={Link}
                to={`/enrollments/edit/${learnerData.id}`}
                variant="contained"
                color="primary"
                startIcon={<PeopleIcon />}
            >
              Sửa
            </Button>
          </Box>
        </Paper>
      </Container>
  );
};

export default ViewLearner;