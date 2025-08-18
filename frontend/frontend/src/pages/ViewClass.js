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
        const response = await axios.get(`http://localhost:8080/driving-school-management/api/classes/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setClassData(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching class:', error);
        alert('Không thể tải dữ liệu lớp học');
      }
    };

    fetchClass();
  }, [id]);

  if (loading) return <Typography>Loading...</Typography>;

  return (
      <Container>
        <Paper elevation={3} sx={{ p: 3, mt: 3 }}>
          <h2>View Class</h2>
          <Typography>ID: {classData.classId}</Typography>
          <Typography>Class Name: {classData.className}</Typography>
          <Typography>Start Date: {classData.startDate}</Typography>
          <Typography>End Date: {classData.endDate}</Typography>
          <Typography>Max Students: {classData.maxStudents}</Typography>
          <Typography>Instructor: {classData.instructorName}</Typography>
          <Typography>Current Students: {classData.currentStudentsCount}</Typography>

          <Box sx={{ mt: 3 }}>
            <Button
                component={Link}
                to={`/class/${id}/learners`}
                variant="contained"
                color="primary"
                startIcon={<PeopleIcon />}
            >
              View Learners
            </Button>
          </Box>
        </Paper>
      </Container>
  );
};

export default ViewClass;