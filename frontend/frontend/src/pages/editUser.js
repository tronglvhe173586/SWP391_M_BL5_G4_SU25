import React, { useState, useEffect } from "react";
import {
  Container,
  TextField,
  Button,
  Typography,
  Box,
  FormControlLabel,
  Checkbox
} from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";

const EditUser = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    username: "",
    fullName: "",
    email: "",
    isActive: true
  });

  const [loading, setLoading] = useState(true);

  // Fetch user data
  useEffect(() => {
  const fetchUser = async () => {
    try {
      const token = localStorage.getItem("jwtToken"); 
      const res = await axios.get(
        `http://localhost:8080/driving-school-management/users/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}` 
          }
        }
      );

      setForm({
        username: res.data.username,
        fullName: res.data.fullName,
        email: res.data.email,
        isActive: res.data.isActive
      });

      setLoading(false);
    } catch (err) {
      console.error(err);
      alert("Failed to fetch user data");
    }
  };
  fetchUser();
}, [id]);


  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
  e.preventDefault();
  try {
    const token = localStorage.getItem("jwtToken"); 
    await axios.put(
      `http://localhost:8080/driving-school-management/users/edit_User/${id}`,
      form,
      {
        headers: {
          Authorization: `Bearer ${token}` 
        }
      }
    );
    alert("User updated successfully!");
    navigate("/users");
  } catch (err) {
    console.error(err);
    alert("Failed to update user");
  }
};

  if (loading) return <Typography>Loading user data...</Typography>;

  return (
    <Container maxWidth="sm" sx={{ mt: 4 }}>
      <Typography variant="h4" mb={3}>
        Edit User
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
          fullWidth
          required
        />
        <TextField
          label="Full Name"
          name="fullName"
          value={form.fullName}
          onChange={handleChange}
          fullWidth
          required
        />
        <TextField
          label="Email"
          name="email"
          type="email"
          value={form.email}
          onChange={handleChange}
          fullWidth
          required
        />
        <FormControlLabel
          control={
            <Checkbox
              name="isActive"
              checked={form.isActive}
              onChange={handleChange}
            />
          }
          label="Is Active"
        />
        <Button variant="contained" color="primary" type="submit">
          Update User
        </Button>
        <Button
          variant="outlined"
          color="secondary"
          onClick={() => navigate("/users")}
        >
          Cancel
        </Button>
      </Box>
    </Container>
  );
};

export default EditUser;
