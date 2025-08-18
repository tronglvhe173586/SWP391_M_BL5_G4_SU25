import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { TextField, Button, Container } from '@mui/material';

const EditClass = () => {
  const { id } = useParams();
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchClass = async () => {
      try {
        const token = localStorage.getItem('jwtToken');
        const response = await axios.get(`http://localhost:8080/api/classes/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setFormData(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching class:', error);
        alert('Không thể tải dữ liệu lớp học');
      }
    };

    fetchClass();
  }, [id]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('jwtToken'); // Lấy token
      await axios.put(`http://localhost:8080/api/classes/${id}`, formData, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      alert('Cập nhật lớp học thành công!');
      navigate('/class-management');
    } catch (error) {
      console.error('Error editing class:', error);
      alert('Cập nhật lớp học thất bại');
    }
  };

  if (loading) return <p>Đang tải dữ liệu lớp học...</p>;

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