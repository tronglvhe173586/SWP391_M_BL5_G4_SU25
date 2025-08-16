import React, { useEffect, useState } from "react";
import { DataGrid } from "@mui/x-data-grid";
import { Paper, TextField, Box } from "@mui/material";
import { Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function ExamTable() {
  const navigate = useNavigate();
  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(false);
  const [keyword, setKeyword] = useState("");

  const columns = [
    { field: "id", headerName: "ID", width: 70 },
    { field: "examName", headerName: "Exam Name", width: 200 },
    { 
      field: "examType", 
      headerName: "Exam Type", 
      width: 150,
      renderCell: (params) => {
        const typeMap = {
          'THEORY': 'Theory',
          'SIMULATION': 'Simulation',
          'PRACTICAL': 'Practical',
          'ON_THE_ROAD': 'On The Road'
        };
        return typeMap[params.value] || params.value;
      }
    },
    { field: "passScore", headerName: "Pass Score", width: 120 },
    {
      field: "actions",
      headerName: "Actions",
      width: 150,
      renderCell: (params) => (
        <Button
          variant="contained"
          color="warning"
          size="small"
          onClick={() => navigate(`/exams/edit/${params.row.id}`)}
        >
          Edit
        </Button>
      )
    }
  ];

  const fetchExams = async () => {
    setLoading(true);
    try {
      const res = await axios.get("http://localhost:8080/driving-school-management/exams");
      setExams(res.data);
    } catch (err) {
      console.error("Error fetching exams:", err);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchExams();
  }, []);

  // Filter exams based on keyword
  const filteredExams = exams.filter(exam =>
    exam.examName.toLowerCase().includes(keyword.toLowerCase()) ||
    exam.examType.toLowerCase().includes(keyword.toLowerCase())
  );

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
        rows={filteredExams}
        columns={columns}
        pageSizeOptions={[10, 20]}
        initialState={{
          pagination: {
            paginationModel: { page: 0, pageSize: 10 },
          },
        }}
        loading={loading}
        disableRowSelectionOnClick
      />
    </Paper>
  );
}
