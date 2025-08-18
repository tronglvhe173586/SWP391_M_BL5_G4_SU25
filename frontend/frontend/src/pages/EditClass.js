import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { TextField, Button, Container } from '@mui/material';

const EditClass = () => {
  const { id } = useParams();
  const [formData, setFormData] = useState({});
  const navigate = useNavigate();

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
        setFormData(response.data);
      } catch (error) {
        alert('Error fetching class: ' + (error.response ? error.response.data.message : error.message));
        console.error('Fetch class error:', error);
      }
    };

    fetchClass();
  }, [id]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    if (!token) {
      alert('No authentication token found. Please login.');
      return;
    }

    try {
      await axios.put(`http://localhost:8080/driving-school-management/api/classes/${id}`, formData, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      navigate('/class-management');
    } catch (error) {
      alert('Error editing class: ' + (error.response ? error.response.data.message : error.message));
      console.error('Edit class error:', error);
    }
  };

  return (
    <Container>
      <h2>Edit Class</h2>
      <form onSubmit={handleSubmit}>
        <TextField name="courseId" label="Course ID" value={formData.courseId || ''} onChange={handleChange} fullWidth />
        <TextField name="className" label="Class Name" value={formData.className || ''} onChange={handleChange} fullWidth />
        <TextField name="startDate" label="Start Date" type="date" value={formData.startDate || ''} onChange={handleChange} fullWidth InputLabelProps={{ shrink: true }} />
        <TextField name="endDate" label="End Date" type="date" value={formData.endDate || ''} onChange={handleChange} fullWidth InputLabelProps={{ shrink: true }} />
        <TextField name="maxStudents" label="Max Students" type="number" value={formData.maxStudents || ''} onChange={handleChange} fullWidth />
        <TextField name="instructorId" label="Instructor ID" value={formData.instructorId || ''} onChange={handleChange} fullWidth />
        <Button type="submit" variant="contained" color="primary">Update</Button>
      </form>
    </Container>
  );
};

export default EditClass;