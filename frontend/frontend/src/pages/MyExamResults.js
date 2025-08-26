import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { configuration } from '../configurations/configuration';
import { Container, Paper, Typography, Box, Chip, CircularProgress, Alert } from '@mui/material';

const MyExamResults = () => {
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const fetchResults = async () => {
        try {
            const token = localStorage.getItem('jwtToken');
            const resp = await axios.get(`${configuration.API_BASE_URL}/exam-results/my`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setResults(resp.data?.result || []);
        } catch (e) {
            setError('Không thể tải kết quả thi của bạn');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchResults(); }, []);

    if (loading) {
        return (
            <Container maxWidth="lg" sx={{ mt: 4, textAlign: 'center' }}>
                <CircularProgress />
                <Typography>Đang tải...</Typography>
            </Container>
        );
    }

    return (
        <Container maxWidth="lg" sx={{ mt: 4 }}>
            <Typography variant="h4" sx={{ mb: 3 }}>Kết quả thi của tôi</Typography>

            {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

            {results.length === 0 ? (
                <Paper sx={{ p: 3 }}>
                    <Typography>Chưa có kết quả thi.</Typography>
                </Paper>
            ) : (
                <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 2 }}>
                    {results.map((r) => (
                        <Paper key={r.id} sx={{ p: 2 }}>
                            <Typography variant="h6">{r.examName}</Typography>
                            <Typography variant="body2" color="text.secondary">Lớp: {r.className || 'N/A'}</Typography>
                            <Typography>Ngày thi: {r.examDate}</Typography>
                            <Typography>Địa điểm: {r.location}</Typography>
                            <Typography>Điểm đạt: {r.passScore}</Typography>
                            <Box sx={{ mt: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
                                <Typography>Điểm:</Typography>
                                {r.score != null ? (
                                    <Chip label={r.score} color={r.isPassed ? 'success' : 'error'} />
                                ) : (
                                    <Chip label="Chưa có" />
                                )}
                            </Box>
                            <Box sx={{ mt: 1 }}>
                                {r.isPassed == null ? (
                                    <Chip label="Chưa có kết quả" />
                                ) : r.isPassed ? (
                                    <Chip label="Đạt" color="success" />
                                ) : (
                                    <Chip label="Không đạt" color="error" />
                                )}
                            </Box>
                        </Paper>
                    ))}
                </Box>
            )}
        </Container>
    );
};

export default MyExamResults;


