import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const ClassManagement = () => {
  const [classes, setClasses] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch classes from backend (mock if backend not ready)
    axios.get('http://localhost:8080/api/classes')
      .then(response => setClasses(response.data))
      .catch(error => console.error('Error fetching classes:', error));
  }, []);

  return (
    <div>
      <h2>Class Management</h2>
      <Button variant="contained" color="primary" onClick={() => navigate('/add-class')}>Add Class</Button>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Class Name</TableCell>
              <TableCell>Start Date</TableCell>
              <TableCell>End Date</TableCell>
              <TableCell>Max Students</TableCell>
              <TableCell>Instructor</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {classes.map(cls => (
              <TableRow key={cls.classId}>
                <TableCell>{cls.classId}</TableCell>
                <TableCell>{cls.className}</TableCell>
                <TableCell>{cls.startDate}</TableCell>
                <TableCell>{cls.endDate}</TableCell>
                <TableCell>{cls.maxStudents}</TableCell>
                <TableCell>{cls.instructorName}</TableCell>
                <TableCell>
                  <Button onClick={() => navigate(`/view-class/${cls.classId}`)}>View</Button>
                  <Button onClick={() => navigate(`/edit-class/${cls.classId}`)}>Edit</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default ClassManagement;