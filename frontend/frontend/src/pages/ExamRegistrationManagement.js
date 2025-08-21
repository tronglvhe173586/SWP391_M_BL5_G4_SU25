import React from 'react';
import { Box, Container, Typography, Paper } from '@mui/material';
import ExamRegistrationTable from '../components/ExamRegistrationTable';

const ExamRegistrationManagement = () => {
  return (
    <Container maxWidth="xl">
      <Box sx={{ py: 4 }}>
        <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
          <Typography variant="h3" component="h1" gutterBottom>
            Exam Registration Management
          </Typography>
          <Typography variant="body1" color="text.secondary" paragraph>
            Manage exam registrations for learners. You can create, edit, delete, and approve/reject exam registration requests.
          </Typography>
        </Paper>
        
        <ExamRegistrationTable />
      </Box>
    </Container>
  );
};

export default ExamRegistrationManagement;
