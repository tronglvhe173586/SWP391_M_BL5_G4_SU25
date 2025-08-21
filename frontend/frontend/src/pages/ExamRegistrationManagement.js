import React, { useState, useEffect } from 'react';
import {
  Container,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Chip,
  Typography,
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  IconButton,
  Tooltip
} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import DeleteIcon from '@mui/icons-material/Delete';
import RefreshIcon from '@mui/icons-material/Refresh';
import axios from 'axios';
import { getToken } from '../services/localStorageService';
import { configuration } from '../configurations/configuration';


const ExamRegistrationManagement = () => {
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [confirmDialog, setConfirmDialog] = useState({
    open: false,
    title: '',
    message: '',
    action: null,
    registrationId: null
  });

  const fetchRegistrations = async () => {
    try {
      setLoading(true);
      const token = getToken();
      const response = await axios.get(`${configuration.API_BASE_URL}/exam-registrations`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      if (response.data && response.data.code === 1000) {
        setRegistrations(response.data.result);
      } else {
        setError('Failed to load registrations');
      }
    } catch (error) {
      setError('Error loading registrations: ' + (error.response?.data?.message || error.message));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRegistrations();
  }, []);

  const handleStatusUpdate = async (registrationId, newStatus) => {
    try {
      const token = getToken();
      const response = await axios.put(`${configuration.API_BASE_URL}/exam-registrations/${registrationId}/status`, {
        status: newStatus
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.data && response.data.code === 1000) {
        setSuccess(`Registration ${newStatus.toLowerCase()}ed successfully`);
        fetchRegistrations();
      } else {
        setError('Failed to update status');
      }
    } catch (error) {
      setError('Error updating status: ' + (error.response?.data?.message || error.message));
    }
  };

  const handleDelete = async (registrationId) => {
    try {
      const token = getToken();
      const response = await axios.delete(`${configuration.API_BASE_URL}/exam-registrations/${registrationId}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (response.data && response.data.code === 1000) {
        setSuccess('Registration deleted successfully');
        fetchRegistrations();
      } else {
        setError('Failed to delete registration');
      }
    } catch (error) {
      setError('Error deleting registration: ' + (error.response?.data?.message || error.message));
    }
  };

  const openConfirmDialog = (title, message, action, registrationId) => {
    setConfirmDialog({
      open: true,
      title,
      message,
      action,
      registrationId
    });
  };

  const closeConfirmDialog = () => {
    setConfirmDialog({
      open: false,
      title: '',
      message: '',
      action: null,
      registrationId: null
    });
  };

  const handleConfirmAction = () => {
    const { action, registrationId } = confirmDialog;
    // Close dialog first to avoid aria-hidden/focus issues
    closeConfirmDialog();
    // Defer action until dialog unmounts
    setTimeout(() => {
      if (action === 'accept') {
        handleStatusUpdate(registrationId, 'CONFIRMED');
      } else if (action === 'reject') {
        handleStatusUpdate(registrationId, 'CANCELLED');
      } else if (action === 'delete') {
        handleDelete(registrationId);
      }
    }, 0);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'PENDING':
        return 'warning';
      case 'CONFIRMED':
        return 'success';
      case 'CANCELLED':
        return 'error';
      default:
        return 'default';
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString('vi-VN');
  };

  return (
    <>
      <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h4" component="h1" gutterBottom>
            Quản lý đăng ký thi
          </Typography>
          <Button
            variant="outlined"
            startIcon={<RefreshIcon />}
            onClick={fetchRegistrations}
            disabled={loading}
          >
            Làm mới
          </Button>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError('')}>
            {error}
          </Alert>
        )}

        {success && (
          <Alert severity="success" sx={{ mb: 2 }} onClose={() => setSuccess('')}>
            {success}
          </Alert>
        )}

        <Paper sx={{ width: '100%', overflow: 'hidden' }}>
          <TableContainer sx={{ maxHeight: 600 }}>
            <Table stickyHeader>
              <TableHead>
                <TableRow>
                  <TableCell>ID</TableCell>
                  <TableCell>Học viên</TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell>Kỳ thi</TableCell>
                  <TableCell>Lịch thi</TableCell>
                  <TableCell>Ngày thi</TableCell>
                  <TableCell>Địa điểm</TableCell>
                  <TableCell>Ngày đăng ký</TableCell>
                  <TableCell>Trạng thái</TableCell>
                  <TableCell>Thao tác</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={10} align="center">
                      Đang tải...
                    </TableCell>
                  </TableRow>
                ) : registrations.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={10} align="center">
                      Không có đăng ký thi nào
                    </TableCell>
                  </TableRow>
                ) : (
                  registrations.map((registration) => (
                    <TableRow key={registration.id} hover>
                      <TableCell>{registration.id}</TableCell>
                      <TableCell>{registration.learnerName}</TableCell>
                      <TableCell>{registration.learnerEmail}</TableCell>
                      <TableCell>{registration.examName}</TableCell>
                      <TableCell>{registration.examScheduleName}</TableCell>
                      <TableCell>{formatDate(registration.examDate)}</TableCell>
                      <TableCell>{registration.location}</TableCell>
                      <TableCell>{formatDate(registration.registrationDate)}</TableCell>
                      <TableCell>
                        <Chip
                          label={registration.status}
                          color={getStatusColor(registration.status)}
                          size="small"
                        />
                      </TableCell>
                      <TableCell>
                        {registration.status === 'PENDING' && (
                          <>
                            <Tooltip title="Chấp nhận">
                              <IconButton
                                color="success"
                                size="small"
                                onClick={() => openConfirmDialog(
                                  'Chấp nhận đăng ký',
                                  `Bạn có chắc chắn muốn chấp nhận đăng ký thi của ${registration.learnerName}?`,
                                  'accept',
                                  registration.id
                                )}
                              >
                                <CheckCircleIcon />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title="Từ chối">
                              <IconButton
                                color="error"
                                size="small"
                                onClick={() => openConfirmDialog(
                                  'Từ chối đăng ký',
                                  `Bạn có chắc chắn muốn từ chối đăng ký thi của ${registration.learnerName}?`,
                                  'reject',
                                  registration.id
                                )}
                              >
                                <CancelIcon />
                              </IconButton>
                            </Tooltip>
                          </>
                        )}
                        <Tooltip title="Xóa">
                          <IconButton
                            color="error"
                            size="small"
                            onClick={() => openConfirmDialog(
                              'Xóa đăng ký',
                              `Bạn có chắc chắn muốn xóa đăng ký thi của ${registration.learnerName}?`,
                              'delete',
                              registration.id
                            )}
                          >
                            <DeleteIcon />
                          </IconButton>
                        </Tooltip>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>

        {/* Confirmation Dialog */}
        <Dialog open={confirmDialog.open} onClose={closeConfirmDialog}>
          <DialogTitle>{confirmDialog.title}</DialogTitle>
          <DialogContent>
            <Typography>{confirmDialog.message}</Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={closeConfirmDialog}>Hủy</Button>
            <Button onClick={handleConfirmAction} color="primary" variant="contained">
              Xác nhận
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    </>
  );
};

export default ExamRegistrationManagement;
