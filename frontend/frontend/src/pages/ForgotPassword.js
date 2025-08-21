import React, { useState } from "react";
import {
    Container,
    TextField,
    Button,
    Typography,
    Box,
    CircularProgress,
    Alert,
    Link
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import axios from "axios";


export default function ForgotPassword() {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setErrorMessage("");

        try {
            await axios.post(`/driving-school-management/forgot-password/verify-email/${email}`);
            navigate("/verify-otp", {
                state: {
                    email,
                    successMessage: "Một mã OTP đã được gửi đến email của bạn. Vui lòng kiểm tra hòm thư."
                }
            });
        } catch (error) {
            console.error(error);
            const message = error.response?.data?.message || "Đã xảy ra lỗi. Vui lòng thử lại.";
            setErrorMessage(message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Container maxWidth="sm" sx={{ mt: 4 }}>
            <Typography variant="h4" gutterBottom>
                Quên mật khẩu
            </Typography>

            {errorMessage && <Alert severity="error" sx={{ mb: 2 }}>{errorMessage}</Alert>}

            <Box
                component="form"
                onSubmit={handleSubmit}
                sx={{ display: "flex", flexDirection: "column", gap: 2 }}
            >
                <TextField
                    label="Email"
                    name="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
                <Button type="submit" variant="contained" disabled={loading}>
                    {loading ? <CircularProgress size={24} /> : "Gửi mã OTP"}
                </Button>
            </Box>
        </Container>
    );
}