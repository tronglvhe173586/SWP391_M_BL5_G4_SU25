import React, { useState } from "react";
import { Container, TextField, Button, Typography, Box, MenuItem, Select, FormControl, InputLabel } from "@mui/material";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function AddExam() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    examName: "",
    examType: "THEORY",
    passScore: ""
  });

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(
        "http://localhost:8080/driving-school-management/exams",
        {
          examName: form.examName,
          examType: form.examType,
          passScore: parseInt(form.passScore)
        }
      );
      alert("Exam added successfully!");
      setForm({
        examName: "",
        examType: "THEORY",
        passScore: ""
      });
      navigate("/exams");
    } catch (error) {
      console.error(error);
      alert("Failed to add exam");
    }
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        Add Exam
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
          required
          fullWidth
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
          value={form.passScore}
          onChange={handleChange}
          type="number"
          required
          fullWidth
          inputProps={{ min: 0, max: 100 }}
        />

        <Button type="submit" variant="contained" color="primary">
          Add Exam
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
}
