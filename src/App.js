import React, { useState, useEffect } from "react";
import { Box, Typography, Grid, TextField, Button } from "@mui/material";
import { LocalizationProvider, DateTimePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import { DataGrid } from "@mui/x-data-grid";
import {
  PieChart,
  Pie,
  Cell,
  Legend,
  Tooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";
import axios from "axios";
import "./App.css";

const columns = [
  { field: "CustomerID", headerName: "Customer ID", width: 130 },
  { field: "Name", headerName: "Customer Name", width: 150 },
  { field: "TransactionID", headerName: "Transaction ID", width: 150 },
  { field: "Address", headerName: "Address", width: 180 },
  { field: "MerchantID", headerName: "Merchant ID", width: 130 },
  { field: "FraudIndicator", headerName: "Fraud", width: 120 },
];

const COLORS = {
  Fraudulent: "#e63946",
  "Non-Fraudulent": "#4caf50",
};

function App() {
  const [startDateTime, setStartDateTime] = useState(null);
  const [endDateTime, setEndDateTime] = useState(null);
  const [rows, setRows] = useState([]);
  const [pieData, setPieData] = useState([]);

  const minDate = dayjs("2000-01-01T00:00:00");
  const maxDate = dayjs("2040-12-31T23:59:59");

  // Fetch transactions & fraud summary from backend
  useEffect(() => {
    axios.get("http://127.0.0.1:8000/transactions")
      .then(res => {
        const formattedRows = res.data.map((row, i) => ({ id: i, ...row }));
        setRows(formattedRows);
      })
      .catch(err => console.error("Error fetching transactions:", err));

    axios.get("http://127.0.0.1:8000/fraud-summary")
      .then(res => {
        setPieData([
          { name: "Fraudulent", value: res.data.fraudulent },
          { name: "Non-Fraudulent", value: res.data.non_fraudulent },
        ]);
      })
      .catch(err => console.error("Error fetching fraud summary:", err));
  }, []);

  const handleFilterClick = () => {
    console.log("Filter applied:", startDateTime?.toString(), endDateTime?.toString());
    // Optional: Add API call to fetch filtered transactions
  };

  return (
    <Box className="app-container">
      <Box className="app-content">
        <Typography variant="h3" component="h1" align="center">
          Real Time Data Analytics
        </Typography>

        {/* Filters */}
        <Box mt={2}>
          <Grid container spacing={4} justifyContent="center" alignItems="center">
            <Grid item xs={12} sm={5}>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DateTimePicker
                  label="Start Date & Time"
                  value={startDateTime}
                  onChange={setStartDateTime}
                  renderInput={(params) => <TextField fullWidth {...params} />}
                  maxDateTime={endDateTime || maxDate}
                  minDateTime={minDate}
                />
              </LocalizationProvider>
            </Grid>
            <Grid item xs={12} sm={5}>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DateTimePicker
                  label="End Date & Time"
                  value={endDateTime}
                  onChange={setEndDateTime}
                  renderInput={(params) => <TextField fullWidth {...params} />}
                  minDateTime={startDateTime || minDate}
                  maxDateTime={maxDate}
                />
              </LocalizationProvider>
            </Grid>
            <Grid item xs={12} sm={2}>
              <Button
                variant="contained"
                color="secondary"
                size="large"
                fullWidth
                onClick={handleFilterClick}
                disabled={!startDateTime || !endDateTime}
              >
                Filter
              </Button>
            </Grid>
          </Grid>
        </Box>

        {/* Charts */}
        <Box mt={4} display="flex" justifyContent="center" alignItems="center" gap={8}>
          <PieChart width={400} height={400}>
            <Pie data={pieData} cx="50%" cy="50%" outerRadius={120} dataKey="value">
              {pieData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[entry.name]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend verticalAlign="bottom" height={36} />
          </PieChart>
        </Box>

        {/* Data Table */}
        <Box mt={4} mx="auto" width="90%">
          <DataGrid rows={rows} columns={columns} pageSize={10} autoHeight />
        </Box>
      </Box>
    </Box>
  );
}

export default App;
