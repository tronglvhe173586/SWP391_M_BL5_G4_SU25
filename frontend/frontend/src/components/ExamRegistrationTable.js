import React, { useState, useEffect } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  IconButton,
  Chip,
  Box,
  Typography,
  Alert,
  Snackbar
} from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
  Add as AddIcon
} from '@mui/icons-material';
import { configuration } from '../configurations/configuration';

const ExamRegistrationTable = () => {
  const [examRegistrations, setExamRegistrations] = useState([]);
  const [users, setUsers] = useState([]);
  const [examSchedules, setExamSchedules] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [openStatusDialog, setOpenStatusDialog] = useState(false);
  const [editingRegistration, setEditingRegistration] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  const [formData, setFormData] = useState({
    learnerId: '',
    examScheduleId: '',
    status: 'PENDING'
  });

  const [statusFormData, setStatusFormData] = useState({
    registrationId: '',
    status: '',
    reason: ''
  });

  useEffect(() => {
    fetchExamRegistrations();
    fetchUsers();
    fetchExamSchedules();
  }, []);

  const fetchExamRegistrations = async () => {
    try {
      const response = await fetch(`${configuration.baseUrl}/api/exam-registrations`);
      const data = await response.json();
      if (data.code === 1000) {
        setExamRegistrations(data.result);
      }
    } catch (error) {
      console.error('Error fetching exam registrations:', error);
      showSnackbar('Error fetching exam registrations', 'error');
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await fetch(`${configuration.baseUrl}/api/users`);
      const data = await response.json();
      if (data.code === 1000) {
        setUsers(data.result);
      }
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const fetchExamSchedules = async () => {
    try {
      const response = await fetch(`${configuration.baseUrl}/api/exam-schedules`);
      const data = await response.json();
      if (data.code === 1000) {
        setExamSchedules(data.result);
      }
    } catch (error) {
      console.error('Error fetching exam schedules:', error);
    }
  };

  const handleOpenDialog = (registration = null) => {
    if (registration) {
      setEditingRegistration(registration);
      setFormData({
        learnerId: registration.learnerId,
        examScheduleId: registration.examScheduleId,
        status: registration.status
      });
    } else {
      setEditingRegistration(null);
      setFormData({
        learnerId: '',
        examScheduleId: '',
        status: 'PENDING'
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingRegistration(null);
    setFormData({
      learnerId: '',
      examScheduleId: '',
      status: 'PENDING'
    });
  };

  const handleOpenStatusDialog = (registration) => {
    setStatusFormData({
      registrationId: registration.id,
      status: '',
      reason: ''
    });
    setOpenStatusDialog(true);
  };

  const handleCloseStatusDialog = () => {
    setOpenStatusDialog(false);
    setStatusFormData({
      registrationId: '',
      status: '',
      reason: ''
    });
  };

  const handleSubmit = async () => {
    try {
      const url = editingRegistration
        ? `${configuration.baseUrl}/api/exam-registrations/${editingRegistration.id}`
        : `${configuration.baseUrl}/api/exam-registrations`;
      
      const method = editingRegistration ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      
      if (data.code === 1000) {
        showSnackbar(
          editingRegistration 
            ? 'Exam registration updated successfully' 
            : 'Exam registration created successfully',
          'success'
        );
        fetchExamRegistrations();
        handleCloseDialog();
      } else {
        showSnackbar(data.message || 'Operation failed', 'error');
      }
    } catch (error) {
      console.error('Error saving exam registration:', error);
      showSnackbar('Error saving exam registration', 'error');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this exam registration?')) {
      try {
        const response = await fetch(`${configuration.baseUrl}/api/exam-registrations/${id}`, {
          method: 'DELETE',
        });

        const data = await response.json();
        
        if (data.code === 1000) {
          showSnackbar('Exam registration deleted successfully', 'success');
          fetchExamRegistrations();
        } else {
          showSnackbar(data.message || 'Delete failed', 'error');
        }
      } catch (error) {
        console.error('Error deleting exam registration:', error);
        showSnackbar('Error deleting exam registration', 'error');
      }
    }
  };

  const handleStatusUpdate = async () => {
    try {
      const response = await fetch(`${configuration.baseUrl}/api/exam-registrations/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(statusFormData),
      });

      const data = await response.json();
      
      if (data.code === 1000) {
        showSnackbar('Status updated successfully', 'success');
        fetchExamRegistrations();
        handleCloseStatusDialog();
      } else {
        showSnackbar(data.message || 'Status update failed', 'error');
      }
    } catch (error) {
      console.error('Error updating status:', error);
      showSnackbar('Error updating status', 'error');
    }
  };

  const showSnackbar = (message, severity) => {
    setSnackbar({ open: true, message, severity });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'PENDING':
        return 'warning';
      case 'APPROVED':
        return 'success';
      case 'REJECTED':
        return 'error';
      default:
        return 'default';
    }
  };

  const getUserName = (userId) => {
    const user = users.find(u => u.id === userId);
    return user ? `${user.firstName} ${user.lastName}` : 'Unknown User';
  };

  const getExamScheduleInfo = (examScheduleId) => {
    const examSchedule = examSchedules.find(es => es.id === examScheduleId);
    return examSchedule ? `${examSchedule.examName} - ${examSchedule.examDate}` : 'Unknown Exam';
  };

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1">
          Exam Registrations Management
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => handleOpenDialog()}
        >
          Add New Registration
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Learner</TableCell>
              <TableCell>Exam Schedule</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Registration Date</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {examRegistrations.map((registration) => (
              <TableRow key={registration.id}>
                <TableCell>{registration.id}</TableCell>
                <TableCell>{getUserName(registration.learnerId)}</TableCell>
                <TableCell>{getExamScheduleInfo(registration.examScheduleId)}</TableCell>
                <TableCell>
                  <Chip
                    label={registration.status}
                    color={getStatusColor(registration.status)}
                    size="small"
                  />
                </TableCell>
                <TableCell>
                  {new Date(registration.registrationDate).toLocaleDateString()}
                </TableCell>
                <TableCell>
                  <IconButton
                    color="primary"
                    onClick={() => handleOpenDialog(registration)}
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton
                    color="secondary"
                    onClick={() => handleOpenStatusDialog(registration)}
                  >
                    {registration.status === 'PENDING' ? <CheckCircleIcon /> : <CancelIcon />}
                  </IconButton>
                  <IconButton
                    color="error"
                    onClick={() => handleDelete(registration.id)}
                  >
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Add/Edit Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>
          {editingRegistration ? 'Edit Exam Registration' : 'Add New Exam Registration'}
        </DialogTitle>
        <DialogContent>
          <FormControl fullWidth sx={{ mt: 2 }}>
            <InputLabel>Learner</InputLabel>
            <Select
              value={formData.learnerId}
              onChange={(e) => setFormData({ ...formData, learnerId: e.target.value })}
              label="Learner"
            >
              {users.filter(user => user.role === 'LEARNER').map((user) => (
                <MenuItem key={user.id} value={user.id}>
                  {user.firstName} {user.lastName}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          
          <FormControl fullWidth sx={{ mt: 2 }}>
            <InputLabel>Exam Schedule</InputLabel>
            <Select
              value={formData.examScheduleId}
              onChange={(e) => setFormData({ ...formData, examScheduleId: e.target.value })}
              label="Exam Schedule"
            >
              {examSchedules.map((schedule) => (
                <MenuItem key={schedule.id} value={schedule.id}>
                  {schedule.examName} - {schedule.examDate}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          
          <FormControl fullWidth sx={{ mt: 2 }}>
            <InputLabel>Status</InputLabel>
            <Select
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              label="Status"
            >
              <MenuItem value="PENDING">PENDING</MenuItem>
              <MenuItem value="APPROVED">APPROVED</MenuItem>
              <MenuItem value="REJECTED">REJECTED</MenuItem>
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={handleSubmit} variant="contained">
            {editingRegistration ? 'Update' : 'Create'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Status Update Dialog */}
      <Dialog open={openStatusDialog} onClose={handleCloseStatusDialog} maxWidth="sm" fullWidth>
        <DialogTitle>Update Registration Status</DialogTitle>
        <DialogContent>
          <FormControl fullWidth sx={{ mt: 2 }}>
            <InputLabel>Status</InputLabel>
            <Select
              value={statusFormData.status}
              onChange={(e) => setStatusFormData({ ...statusFormData, status: e.target.value })}
              label="Status"
            >
              <MenuItem value="APPROVED">APPROVED</MenuItem>
              <MenuItem value="REJECTED">REJECTED</MenuItem>
            </Select>
          </FormControl>
          
          {statusFormData.status === 'REJECTED' && (
            <TextField
              fullWidth
              label="Reason for rejection"
              multiline
              rows={3}
              value={statusFormData.reason}
              onChange={(e) => setStatusFormData({ ...statusFormData, reason: e.target.value })}
              sx={{ mt: 2 }}
            />
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseStatusDialog}>Cancel</Button>
          <Button onClick={handleStatusUpdate} variant="contained">
            Update Status
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default ExamRegistrationTable;
