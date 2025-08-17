import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { 
  Container, 
  Typography, 
  Paper, 
  Box,
  CircularProgress,
  Alert,
  Breadcrumbs,
  Link as MuiLink
} from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { Link } from 'react-router-dom';

const ClassLearners = () => {
  const { id } = useParams();
  const [classData, setClassData] = useState(null);
  const [learners, setLearners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchClassData = async () => {
      try {
        // Fetch class details
        const classResponse = await axios.get(`http://localhost:8080/api/classes/${id}`);
        setClassData(classResponse.data);

        // Fetch learners for this class
        const learnersResponse = await axios.get(`http://localhost:8080/api/classes/${id}/learners`);
        setLearners(learnersResponse.data);

        setLoading(false);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Failed to load data. Please try again later.');
        setLoading(false);
      }
    };

    fetchClassData();
  }, [id]);

  const columns = [
    { field: 'id', headerName: 'ID', width: 90 },
    { field: 'firstName', headerName: 'First Name', width: 150 },
    { field: 'lastName', headerName: 'Last Name', width: 150 },
    { field: 'email', headerName: 'Email', width: 250 },
    { field: 'phoneNumber', headerName: 'Phone Number', width: 150 },
    { field: 'registrationDate', headerName: 'Registration Date', width: 180,
      valueGetter: (params) => new Date(params.row.registrationDate).toLocaleDateString() 
    },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 150,
      renderCell: (params) => (
        <Box>
          <MuiLink 
            component={Link} 
            to={`/users/${params.row.id}`}
            sx={{ mr: 2 }}
          >
            View
          </MuiLink>
        </Box>
      ),
    },
  ];

  if (loading) {
    return (
      <Container sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Container>
    );
  }

  if (error) {
    return (
      <Container sx={{ mt: 4 }}>
        <Alert severity="error">{error}</Alert>
      </Container>
    );
  }

  return (
    <Container sx={{ mt: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Breadcrumbs aria-label="breadcrumb">
          <MuiLink component={Link} to="/" color="inherit">
            Home
          </MuiLink>
          <MuiLink component={Link} to="/class-management" color="inherit">
            Classes
          </MuiLink>
          <MuiLink component={Link} to={`/view-class/${id}`} color="inherit">
            Class Details
          </MuiLink>
          <Typography color="text.primary">Learners</Typography>
        </Breadcrumbs>
      </Box>

      <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
        <Typography variant="h4" gutterBottom>
          Learners in {classData?.className}
        </Typography>
        <Typography variant="body1" paragraph>
          Instructor: {classData?.instructorName}
        </Typography>
        <Typography variant="body1" paragraph>
          Class Period: {new Date(classData?.startDate).toLocaleDateString()} to {new Date(classData?.endDate).toLocaleDateString()}
        </Typography>
        <Typography variant="body1" paragraph>
          Total Learners: {learners.length} / {classData?.maxStudents}
        </Typography>
      </Paper>

      <Paper elevation={3} sx={{ height: 400, width: '100%' }}>
        <DataGrid
          rows={learners}
          columns={columns}
          pageSize={5}
          rowsPerPageOptions={[5, 10, 25]}
          disableSelectionOnClick
          sx={{ 
            '& .MuiDataGrid-cell:hover': {
              color: 'primary.main',
            },
          }}
        />
      </Paper>
    </Container>
  );
};

export default ClassLearners;
