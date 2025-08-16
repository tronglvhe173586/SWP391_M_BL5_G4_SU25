import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { TextField, Button, Container } from '@mui/material';

const EditClass = () => {
  const { id } = useParams();
  const [formData, setFormData] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    axios.get(`http://localhost:8080/api/classes/${id}`)
      .then(response => setFormData(response.data))
      .catch(error => console.error('Error fetching class:', error));
  }, [id]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    axios.put(`http://localhost:8080/api/classes/${id}`, formData)
      .then(() => navigate('/class-management'))
      .catch(error => console.error('Error editing class:', error));
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