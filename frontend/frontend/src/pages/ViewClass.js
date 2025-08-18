import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { Container, Typography } from '@mui/material';

const ViewClass = () => {
  const { id } = useParams();
  const [classData, setClassData] = useState(null);

  useEffect(() => {
    const fetchClass = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        alert('No authentication token found. Please login.');
        return;
      }

      try {
        const response = await axios.get(`http://localhost:8080/driving-school-management/api/classes/${id}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        setClassData(response.data);
      } catch (error) {
        alert('Error fetching class: ' + (error.response ? error.response.data.message : error.message));
        console.error('Fetch class error:', error);
      }
    };

    fetchClass();
  }, [id]);

  if (!classData) return <Typography>Loading...</Typography>;

  return (
    <Container>
      <h2>View Class</h2>
      <Typography>ID: {classData.classId}</Typography>
      <Typography>Class Name: {classData.className}</Typography>
      <Typography>Start Date: {classData.startDate}</Typography>
      <Typography>End Date: {classData.endDate}</Typography>
      <Typography>Max Students: {classData.maxStudents}</Typography>
      <Typography>Instructor: {classData.instructorName}</Typography>
      <Typography>Current Students: {classData.currentStudentsCount}</Typography>
    </Container>
  );
};

export default ViewClass;