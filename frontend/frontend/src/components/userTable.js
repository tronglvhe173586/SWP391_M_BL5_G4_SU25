import React, { useEffect, useState } from "react";
import { DataGrid } from "@mui/x-data-grid";
import { Paper, TextField, Box } from "@mui/material";
import { Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function UserTable() {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [totalElements, setTotalElements] = useState(0);
  const [page, setPage] = useState(0); 
  const [pageSize, setPageSize] = useState(10);
  const [loading, setLoading] = useState(false);
  const [keyword, setKeyword] = useState("");


  const columns = [
    { field: "id", headerName: "ID", width: 70 },
    { field: "username", headerName: "Username", width: 150 },
    { field: "fullName", headerName: "Full Name", width: 180 },
    { field: "email", headerName: "Email", width: 200 },
    { field: "role", headerName: "Role", width: 130 },
    {
      field: "isActive",
      headerName: "Active",
      width: 100,
      renderCell: (params) => (params.value ? "Yes" : "No")
    },
    {
      field: "actions",
      headerName: "Actions",
      width: 150,
      renderCell: (params) => (
        <Button
          variant="contained"
          color="warning"
          size="small"
          onClick={() => navigate(`/users/edit/${params.row.id}`)}
        >
          Edit
        </Button>
      )
    }
  ];

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await axios.get("http://localhost:8080/driving-school-management/users/users_pagination?", {
        params: {
          page: page,
          size: pageSize,
          keyword: keyword
        }
      });
      setUsers(res.data.content);
      setTotalElements(res.data.totalElements);
    } catch (err) {
      console.error("Error fetching users:", err);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchUsers();
  }, [page, pageSize, keyword]);

  return (
    <Paper sx={{ height: 500, width: "100%" }}>
    <Box sx={{ p: 2 }}>
        <TextField
          label="Search"
          variant="outlined"
          size="small"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          fullWidth
        />
      </Box>
      <DataGrid
        rows={users}
        columns={columns}
        paginationMode="server"
        rowCount={totalElements}
        pageSizeOptions={[10, 20]}
        paginationModel={{ page, pageSize }}
        onPaginationModelChange={(model) => {
          setPage(model.page);
          setPageSize(model.pageSize);
        }}
        loading={loading}
        disableRowSelectionOnClick
      />
    </Paper>
  );
}
