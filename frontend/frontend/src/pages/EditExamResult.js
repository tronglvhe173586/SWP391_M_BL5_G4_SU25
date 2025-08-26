import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import { configuration } from '../configurations/configuration';
import { Container, Paper, Box, Typography, TextField, Button, Alert, CircularProgress, Chip, Grid } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

const EditExamResult = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [score, setScore] = useState('');
    const [detail, setDetail] = useState(null);

    const fetchDetail = async () => {
        try {
            const token = localStorage.getItem('jwtToken');
            const resp = await axios.get(`${configuration.API_BASE_URL}/exam-results/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            const data = resp.data?.result;
            setDetail(data);
            setScore(data?.score ?? '');
        } catch (e) {
            setError('Không thể tải chi tiết kết quả thi');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDetail();
    }, [id]);

    const handleSave = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        const parsed = parseFloat(score);
        if (isNaN(parsed) || parsed < 0 || parsed > 100) {
            setError('Điểm phải là số từ 0 đến 100');
            return;
        }
        try {
            setSaving(true);
            const token = localStorage.getItem('jwtToken');
            const resp = await axios.put(`${configuration.API_BASE_URL}/exam-results/${id}`, { score: parsed }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setSuccess('Cập nhật kết quả thi thành công');
            setDetail(resp.data?.result);
            setScore(resp.data?.result?.score ?? parsed);
            setTimeout(() => navigate('/exam-results'), 1000);
        } catch (e) {
            setError(e.response?.data?.message || 'Cập nhật không thành công');
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <Container maxWidth="md" sx={{ mt: 4, textAlign: 'center' }}>
                <CircularProgress />
                <Typography>Đang tải...</Typography>
            </Container>
        );
    }

    return (
        <Container maxWidth="md" sx={{ mt: 4 }}>
            <Box sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 2 }}>
                <Button startIcon={<ArrowBackIcon />} variant="outlined" onClick={() => navigate('/exam-results')}>Quay lại</Button>
                <Typography variant="h4">Sửa Kết Quả Thi</Typography>
            </Box>

            {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
            {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}

            <Paper sx={{ p: 3 }}>
                <Typography variant="h6" gutterBottom>Thông tin</Typography>
                <Grid container spacing={2} sx={{ mb: 2 }}>
                    <Grid item xs={12} md={6}>
                        <Typography>Học viên: <strong>{detail?.learnerName}</strong></Typography>
                        <Typography>Email: {detail?.learnerEmail}</Typography>
                        <Typography>Lớp: {detail?.className || 'N/A'}</Typography>
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <Typography>Kỳ thi: <strong>{detail?.examName}</strong></Typography>
                        <Typography>Ngày thi: {detail?.examDate}</Typography>
                        <Typography>Điểm đạt: {detail?.passScore}</Typography>
                    </Grid>
                </Grid>

                <Box component="form" onSubmit={handleSave} sx={{ mt: 1 }}>
                    <TextField
                        fullWidth
                        label="Điểm"
                        type="number"
                        value={score}
                        onChange={(e) => setScore(e.target.value)}
                        inputProps={{ min: 0, max: 100, step: 0.01 }}
                        helperText="Nhập điểm từ 0.0 đến 100.0"
                    />

                    <Box sx={{ mt: 2 }}>
                        <Typography>Kết quả hiện tại:</Typography>
                        <Chip label={detail?.isPassed ? 'Đạt' : 'Không đạt'} color={detail?.isPassed ? 'success' : 'error'} />
                    </Box>

                    <Box sx={{ mt: 3, display: 'flex', gap: 2 }}>
                        <Button type="submit" variant="contained" disabled={saving} sx={{ minWidth: 120 }}>
                            {saving ? <CircularProgress size={22} /> : 'Lưu'}
                        </Button>
                        <Button variant="outlined" onClick={() => navigate('/exam-results')}>Hủy</Button>
                    </Box>
                </Box>
            </Paper>
        </Container>
    );
};

export default EditExamResult;


