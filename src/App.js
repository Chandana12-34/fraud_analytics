import React, { useState } from "react";
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
import "./App.css";

const columns = [
  { field: "CustomerID", headerName: "Customer ID", width: 130 },
  { field: "CustomerName", headerName: "Customer Name", width: 150 },
  { field: "TransactionID", headerName: "Transaction ID", width: 150 },
  { field: "Address", headerName: "Address", width: 180 },
  { field: "MerchantID", headerName: "Merchant ID", width: 130 },
  { field: "FraudPercentage", headerName: "Fraud Percentage", width: 150 },
];

const initialRows = [];

// ✅ Colors
const COLORS = {
  Fraudulent: "#e63946", // red
  "Non-Fraudulent": "#4caf50", // green
  Retail: "#2196f3",
  Other: "#ff9800",
  Food: "#9c27b0",
  Travel: "#4caf50",
};

// Pie Data
const pieData = [
  { name: "Fraudulent", value: 30 },
  { name: "Non-Fraudulent", value: 70 },
];

// ✅ Transaction Type Data with Fraud/Non-Fraud split
const transactionTypeData = [
  { type: "Retail", fraud: 30, nonFraud: 70 },
  { type: "Other", fraud: 10, nonFraud: 50 },
  { type: "Food", fraud: 20, nonFraud: 60 },
  { type: "Travel", fraud: 5, nonFraud: 35 },
];

function App() {
  const [startDateTime, setStartDateTime] = useState(null);
  const [endDateTime, setEndDateTime] = useState(null);
  const [rows, setRows] = useState(initialRows);
  const minDate = dayjs("2000-01-01T00:00:00");
  const maxDate = dayjs("2040-12-31T23:59:59");

  const handleFilterClick = () => {
    console.log(
      "Filter applied:",
      startDateTime?.toString(),
      endDateTime?.toString()
    );
  };

  return (
    <Box className="app-container">
      <Box className="app-content">
        <Typography
          variant="h3"
          component="h1"
          className="app-header"
          align="center"
        >
          Real Time Data Analytics
        </Typography>

        {/* Filters */}
        <Box className="filters-container" mt={2}>
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
        <Box
          className="charts-container"
          mt={4}
          display="flex"
          justifyContent="center"
          alignItems="center"
          gap={8}
        >
          {/* Pie Chart */}
          <PieChart width={400} height={400}>
            <Pie
              data={pieData}
              cx="50%"
              cy="50%"
              outerRadius={120}
              dataKey="value"
            >
              {pieData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[entry.name]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend verticalAlign="bottom" height={36} />
          </PieChart>

          {/* ✅ Transaction Type Analysis with Fraud/Non-Fraud split */}
          <Box>
            <Typography variant="h5" align="center" gutterBottom>
              Transaction Type Analysis
            </Typography>
            <BarChart
              width={500}
              height={400}
              data={transactionTypeData}
              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="type" />
              <YAxis />
              <Tooltip />
              <Legend />
              {/* Fraudulent bar */}
              <Bar dataKey="fraud" name="Fraudulent" fill={COLORS["Fraudulent"]} />
              {/* Non-Fraudulent bar */}
              <Bar
                dataKey="nonFraud"
                name="Non-Fraudulent"
                fill={COLORS["Non-Fraudulent"]}
              />
            </BarChart>
          </Box>
        </Box>

        {/* Table */}
        <Box className="data-grid-container" mt={4} mx="auto" width="90%">
          <DataGrid rows={rows} columns={columns} pageSize={10} autoHeight />
        </Box>
      </Box>
    </Box>
  );
}

export default App;
