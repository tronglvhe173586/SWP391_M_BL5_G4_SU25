import React, { useState, useEffect } from "react";
import {
  Container,
  TextField,
  Button,
  Typography,
  Box,
  MenuItem,
  Select,
  FormControl,
  InputLabel
} from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";

const EditExam = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    examName: "",
    examType: "THEORY",
    passScore: ""
  });

  const [loading, setLoading] = useState(true);

  // Fetch exam data
  useEffect(() => {
    const fetchExam = async () => {
      try {
        console.log("Fetching exam with ID:", id);
        const res = await axios.get(
          `http://localhost:8080/driving-school-management/exams/${id}`
        );
        console.log("Exam data received:", res.data);
        setForm({
          examName: res.data.examName,
          examType: res.data.examType,
          passScore: res.data.passScore
        });
        setLoading(false);
      } catch (err) {
        console.error("Error fetching exam:", err);
        console.error("Error response:", err.response?.data);
        alert(`Failed to fetch exam data: ${err.response?.data?.message || err.message}`);
        setLoading(false);
      }
    };
    fetchExam();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      console.log("Updating exam with ID:", id);
      console.log("Form data:", form);
      const updateData = {
        examName: form.examName,
        examType: form.examType,
        passScore: parseInt(form.passScore)
      };
      console.log("Sending update data:", updateData);
      
      const res = await axios.put(
        `http://localhost:8080/driving-school-management/exams/${id}`,
        updateData
      );
      console.log("Update response:", res.data);
      alert("Exam updated successfully!");
      navigate("/exams");
    } catch (err) {
      console.error("Error updating exam:", err);
      console.error("Error response:", err.response?.data);
      alert(`Failed to update exam: ${err.response?.data?.message || err.message}`);
    }
  };

  if (loading) return <Typography>Loading exam data...</Typography>;

  return (
    <Container maxWidth="sm" sx={{ mt: 4 }}>
      <Typography variant="h4" mb={3}>
        Edit Exam
      </Typography>
      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{ display: "flex", flexDirection: "column", gap: 2 }}
      >
        <TextField
          label="Exam Name"
          name="examName"
          value={form.examName}
          onChange={handleChange}
          fullWidth
          required
        />
        
        <FormControl fullWidth>
          <InputLabel>Exam Type</InputLabel>
          <Select
            name="examType"
            value={form.examType}
            onChange={handleChange}
            label="Exam Type"
          >
            <MenuItem value="THEORY">Theory</MenuItem>
            <MenuItem value="SIMULATION">Simulation</MenuItem>
            <MenuItem value="PRACTICAL">Practical</MenuItem>
            <MenuItem value="ON_THE_ROAD">On The Road</MenuItem>
          </Select>
        </FormControl>

        <TextField
          label="Pass Score"
          name="passScore"
          type="number"
          value={form.passScore}
          onChange={handleChange}
          fullWidth
          required
          inputProps={{ min: 0, max: 100 }}
        />
        
        <Button variant="contained" color="primary" type="submit">
          Update Exam
        </Button>
        <Button
          variant="outlined"
          color="secondary"
          onClick={() => navigate("/exams")}
        >
          Cancel
        </Button>
      </Box>
    </Container>
  );
};

export default EditExam;
