import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { Container, Typography } from '@mui/material';

const ViewClass = () => {
  const { id } = useParams();
  const [classData, setClassData] = useState(null);

  useEffect(() => {
    axios.get(`http://localhost:8080/api/classes/${id}`)
      .then(response => setClassData(response.data))
      .catch(error => console.error('Error fetching class:', error));
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