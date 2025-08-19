import React, { useState, useEffect } from "react";
import {
    Container, TextField, Button, Typography, Box,
    CircularProgress, Alert, Link
} from "@mui/material";
import { useNavigate, useLocation, Link as RouterLink } from "react-router-dom";
import axios from "axios";

export default function VerifyOtp() {
    const navigate = useNavigate();
    const location = useLocation();
    const email = location.state?.email;

    const [otp, setOtp] = useState("");
    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [resendLoading, setResendLoading] = useState(false);
    const [countdown, setCountdown] = useState(30);

    useEffect(() => {
        if (countdown > 0) {
            const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
            return () => clearTimeout(timer);
        }
    }, [countdown]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setErrorMessage("");

        if (!email) {
            setErrorMessage("Email không hợp lệ. Vui lòng quay lại trang Quên mật khẩu.");
            setLoading(false);
            return;
        }

        try {
            await axios.post(`/driving-school-management/forgot-password/verify-otp/${otp}/${email}`);
            navigate("/change-password", { state: { email, otp } });
        } catch (error) {
            console.error(error);
            const message = error.response?.data?.message || "Mã OTP không hợp lệ hoặc đã hết hạn.";
            setErrorMessage(message);
        } finally {
            setLoading(false);
        }
    };

    const handleResendOtp = async () => {
        setResendLoading(true);
        setErrorMessage("");

        try {
            await axios.post(`/driving-school-management/forgot-password/verify-email/${email}`);
            setCountdown(30);
            alert("Mã OTP mới đã được gửi. Vui lòng kiểm tra email của bạn.");
        } catch (error) {
            console.error(error);
            const message = error.response?.data?.message || "Không thể gửi lại mã OTP. Vui lòng thử lại sau.";
            setErrorMessage(message);
        } finally {
            setResendLoading(false);
        }
    };

    return (
        <Container maxWidth="sm" sx={{ mt: 4 }}>
            <Typography variant="h4" gutterBottom>
                Xác minh mã OTP
            </Typography>
            <Typography variant="body1" gutterBottom>
                Một mã xác minh đã được gửi đến email của bạn: **{email}**.
            </Typography>

            {errorMessage && <Alert severity="error" sx={{ mb: 2 }}>{errorMessage}</Alert>}

            <Box
                component="form"
                onSubmit={handleSubmit}
                sx={{ display: "flex", flexDirection: "column", gap: 2 }}
            >
                <TextField
                    label="Mã OTP"
                    name="otp"
                    type="text"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    required
                />
                <Button type="submit" variant="contained" disabled={loading}>
                    {loading ? <CircularProgress size={24} /> : "Xác minh"}
                </Button>
            </Box>

            <Box sx={{ mt: 2, display: "flex", flexDirection: "column", alignItems: "center" }}>
                <Typography variant="body2">
                    {countdown > 0 ? `Bạn có thể gửi lại mã sau ${countdown} giây` : "Bạn không nhận được mã?"}
                </Typography>
                <Button
                    onClick={handleResendOtp}
                    disabled={resendLoading || countdown > 0}
                    sx={{ mt: 1 }}
                >
                    {resendLoading ? <CircularProgress size={24} /> : "Gửi lại mã"}
                </Button>
            </Box>
        </Container>
    );
}