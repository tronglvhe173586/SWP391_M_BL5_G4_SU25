import React, { useState, useEffect } from "react";
import {
    Container, TextField, Button, Typography, Box,
    CircularProgress, Alert, Link, MenuItem
} from "@mui/material";
import { useNavigate, Link as RouterLink } from "react-router-dom";
import axios from "axios";

export default function Register() {
    const navigate = useNavigate();
    const [form, setForm] = useState({
        username: "",
        password: "",
        email: "",
        firstName: "",
        lastName: "",
        gender: "Nam", // giữ đúng giá trị enum backend
        dateOfBirth: "",
        provinceId: ""
    });

    const [provinces, setProvinces] = useState([]);
    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [successMessage, setSuccessMessage] = useState("");

    useEffect(() => {
        const fetchProvinces = async () => {
            try {
                const res = await axios.get("/driving-school-management/provinces");
                setProvinces(res.data);
            } catch (err) {
                console.error("Error loading provinces", err);
                setErrorMessage("Không thể tải danh sách tỉnh thành.");
            }
        };
        fetchProvinces();
    }, []);

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setErrorMessage("");
        setSuccessMessage("");

        try {
            await axios.post("/driving-school-management/users/register", form);
            setSuccessMessage("Đăng ký thành công! Đang chuyển hướng đến đăng nhập...");
            setTimeout(() => navigate("/login"), 2000);
        } catch (error) {
            console.error(error);
            if (error.response && error.response.data) {
                setErrorMessage(error.response.data.message || JSON.stringify(error.response.data));
            } else {
                setErrorMessage(error.message);
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <Container maxWidth="sm" sx={{ mt: 4 }}>
            <Typography variant="h4" gutterBottom>Register</Typography>

            {errorMessage && <Alert severity="error" sx={{ mb: 2 }}>{errorMessage}</Alert>}
            {successMessage && <Alert severity="success" sx={{ mb: 2 }}>{successMessage}</Alert>}

            <Box component="form" onSubmit={handleSubmit} sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                <TextField label="First Name" name="firstName" value={form.firstName} onChange={handleChange} required />
                <TextField label="Last Name" name="lastName" value={form.lastName} onChange={handleChange} required />
                <TextField label="Email" name="email" type="email" value={form.email} onChange={handleChange} required />
                <TextField label="Username" name="username" value={form.username} onChange={handleChange} required />
                <TextField label="Password" name="password" type="password" value={form.password} onChange={handleChange} required />

                {/* Gender select */}
                <TextField select label="Gender" name="gender" value={form.gender} onChange={handleChange}>
                    <MenuItem value="Nam">Nam</MenuItem>
                    <MenuItem value="Nữ">Nữ</MenuItem>
                </TextField>

                <TextField
                    label="Date of Birth"
                    name="dateOfBirth"
                    type="date"
                    InputLabelProps={{ shrink: true }}
                    value={form.dateOfBirth}
                    onChange={handleChange}
                />

                {/* Province select */}
                <TextField
                    select
                    label="Province"
                    name="provinceId"
                    value={form.provinceId}
                    onChange={handleChange}
                    required
                >
                    {provinces.length > 0 ? (
                        provinces.map((p) => (
                            <MenuItem key={p.id} value={p.id}>
                                {p.name}
                            </MenuItem>
                        ))
                    ) : (
                        <MenuItem disabled>Đang tải...</MenuItem>
                    )}
                </TextField>

                <Button type="submit" variant="contained" disabled={loading}>
                    {loading ? <CircularProgress size={24} /> : "Register"}
                </Button>

                <Typography variant="body2" align="center">
                    Have an account?{" "}
                    <Link component={RouterLink} to="/login">Login</Link>
                </Typography>
            </Box>
        </Container>
    );
}