import React, { useState } from 'react';
import axios from 'axios';
import { TextField, Button, Container } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const AddClass = () => {
  const [formData, setFormData] = useState({
    courseId: '',
    className: '',
    startDate: '',
    endDate: '',
    maxStudents: '',
    instructorId: ''
  });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('jwtToken');
      const response = await axios.post(
          'http://localhost:8080/api/classes',
          formData,
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
      );
      console.log('Class added:', response.data);
      navigate('/class-management');
    } catch (error) {
      console.error('Error adding class:', error);
      alert('Thêm lớp thất bại');
    }
  };

  return (
      <Container>
        <h2>Add Class</h2>
        <form onSubmit={handleSubmit}>
          <TextField name="courseId" label="Course ID" value={formData.courseId} onChange={handleChange} fullWidth required />
          <TextField name="className" label="Class Name" value={formData.className} onChange={handleChange} fullWidth required />
          <TextField name="startDate" label="Start Date" type="date" value={formData.startDate} onChange={handleChange} fullWidth required InputLabelProps={{ shrink: true }} />
          <TextField name="endDate" label="End Date" type="date" value={formData.endDate} onChange={handleChange} fullWidth required InputLabelProps={{ shrink: true }} />
          <TextField name="maxStudents" label="Max Students" type="number" value={formData.maxStudents} onChange={handleChange} fullWidth required />
          <TextField name="instructorId" label="Instructor ID" value={formData.instructorId} onChange={handleChange} fullWidth required />
          <Button type="submit" variant="contained" color="primary">Add</Button>
        </form>
      </Container>
  );
};

export default AddClass;