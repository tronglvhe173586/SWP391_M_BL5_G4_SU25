import React from "react";
import UserTable from "../components/userTable";
import { Container, Typography, Button } from "@mui/material";
import { Link } from "react-router-dom";

export default function UserManagement() {
  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        User Management
      </Typography>
      <UserTable />
      <Link to="/add-instructor">
        <Button variant="contained" color="success" sx={{ mt: 10 }}>
          Add Instructor
        </Button>
      </Link>
    </Container>
    
  );
}
