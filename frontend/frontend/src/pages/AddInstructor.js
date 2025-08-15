import React, { use, useState } from "react";
import { Container, TextField, Button, Typography, Box, MenuItem, Select } from "@mui/material";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function AddInstructor() {
  
    const navigate = useNavigate();

  const [form, setForm] = useState({
    username: "",
    passwordHash: "",
    email: "",
    fullName: "",
    employeeId: "",
    certificationInfo: "Bằng lái hạng A1"
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
        "http://localhost:8080/driving-school-management/users/Add_Instructor",
        form
      );
      alert("Instructor added successfully!");
      setForm({
        username: "",
        passwordHash: "",
        email: "",
        fullName: "",
        employeeId: "",
        certificationInfo: ""
      }
    );
    navigate("/users");
    } catch (error) {
      console.error(error);
      alert("Failed to add instructor");

    }
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        Add Instructor
      </Typography>
      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{ display: "flex", flexDirection: "column", gap: 2 }}
      >
        <TextField
          label="Username"
          name="username"
          value={form.username}
          onChange={handleChange}
          required
        />
        <TextField
          label="Password Hash"
          name="passwordHash"
          value={form.passwordHash}
          onChange={handleChange}
          type="text"
          required
        />
        <TextField
          label="Email"
          name="email"
          value={form.email}
          onChange={handleChange}
          type="email"
          required
        />
        <TextField
          label="Full Name"
          name="fullName"
          value={form.fullName}
          onChange={handleChange}
          required
        />
        <TextField
          label="Employee ID"
          name="employeeId"
          value={form.employeeId}
          onChange={handleChange}
          required
        />

        <Select
            name="certificationInfo"
            value={form.certificationInfo}
            onChange={handleChange}
            >
        <MenuItem value="Bằng lái hạng A1">Bằng lái hạng A1</MenuItem>
        <MenuItem value="Bằng lái hạng A2">Bằng lái hạng A2</MenuItem>
        <MenuItem value="Bằng lái hạng B1">Bằng lái hạng B1</MenuItem>
        <MenuItem value="Bằng lái hạng B2">Bằng lái hạng B2</MenuItem>
        <MenuItem value="Bằng lái hạng C">Bằng lái hạng C</MenuItem>
        <MenuItem value="Bằng lái hạng D">Bằng lái hạng D</MenuItem>
        <MenuItem value="Bằng lái hạng E">Bằng lái hạng E</MenuItem>
        <MenuItem value="Bằng lái hạng F">Bằng lái hạng F</MenuItem>
    </Select>
        <Button type="submit" variant="contained">
          Add Instructor
        </Button>
      </Box>
    </Container>
  );
}
