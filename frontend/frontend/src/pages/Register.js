import React, { useState } from "react";
import { Container, TextField, Button, Typography, Box, CircularProgress, Alert, Link } from "@mui/material";
import { useNavigate, Link as RouterLink } from "react-router-dom";
import axios from "axios";


export default function Register() {
    const navigate = useNavigate();
    const [form, setForm] = useState({
        username: "",
        password: "",
        email: "",
        fullName: ""
    });
    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [successMessage, setSuccessMessage] = useState("");

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
            setTimeout(() => {
                navigate("/login");
            }, 2000);
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
            <Typography variant="h4" gutterBottom>
                Register
            </Typography>

            {errorMessage && <Alert severity="error" sx={{ mb: 2 }}>{errorMessage}</Alert>}
            {successMessage && <Alert severity="success" sx={{ mb: 2 }}>{successMessage}</Alert>}

            <Box
                component="form"
                onSubmit={handleSubmit}
                sx={{ display: "flex", flexDirection: "column", gap: 2 }}
            >
                <TextField
                    label="Full Name"
                    name="fullName"
                    value={form.fullName}
                    onChange={handleChange}
                    required
                />
                <TextField
                    label="Email"
                    name="email"
                    type="email"
                    value={form.email}
                    onChange={handleChange}
                    required
                />
                <TextField
                    label="Username"
                    name="username"
                    value={form.username}
                    onChange={handleChange}
                    required
                />
                <TextField
                    label="Password"
                    name="password"
                    type="password"
                    value={form.password}
                    onChange={handleChange}
                    required
                />
                <Button type="submit" variant="contained" disabled={loading}>
                    {loading ? <CircularProgress size={24} /> : "Register"}
                </Button>
                <Typography variant="body2" align="center">
                    Have an account?{" "}
                    <Link component={RouterLink} to="/login">
                        Login
                    </Link>
                </Typography>
            </Box>
        </Container>
    );
}