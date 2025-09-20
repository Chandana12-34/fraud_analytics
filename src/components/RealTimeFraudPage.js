import React, { useState } from "react";
import { Box, Typography, Grid, TextField, Button } from "@mui/material";
import { LocalizationProvider, DateTimePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import { DataGrid } from "@mui/x-data-grid";
import { PieChart, Pie, Cell, Legend, Tooltip } from "recharts";

const columns = [
  { field: "CustomerID", headerName: "Customer ID", width: 130 },
  { field: "CustomerName", headerName: "Customer Name", width: 150 },
  { field: "TransactionID", headerName: "Transaction ID", width: 150 },
  { field: "Address", headerName: "Address", width: 180 },
  { field: "MerchantID", headerName: "Merchant ID", width: 130 },
  { field: "FraudPercentage", headerName: "Fraud Percentage", width: 150 },
];

// Example pie chart data (you can replace with backend API later)
const pieData = [
  { name: "Fraudulent", value: 30 },
  { name: "Non-Fraudulent", value: 70 },
];
const COLORS = ["#ff4d4f", "#4caf50"];

export default function RealTimeFraudPage() {
  const [startDateTime, setStartDateTime] = useState(null);
  const [endDateTime, setEndDateTime] = useState(null);
  const [rows, setRows] = useState([]);

  const minDate = dayjs("2000-01-01T00:00:00");
  const maxDate = dayjs("2040-12-31T23:59:59");

  const handleFilterClick = () => {
    // Placeholder for filter logic (connect to backend API later)
    console.log("Filter applied:", startDateTime?.toString(), endDateTime?.toString());
  };

  return (
    <Box
      sx={{
        height: "100vh",
        width: "100vw",
        display: "flex",
        flexDirection: "column",
        bgcolor: "#f0f2f5",
        p: 2,
      }}
    >
      <Typography
        variant="h3"
        component="h1"
        align="center"
        sx={{ my: 3, fontWeight: "bold", color: "#1976d2" }}
      >
        Real Time Fraud Analytics
      </Typography>
      {/* Filters */}
      <Box sx={{ maxWidth: 1000, margin: "0 auto", flexGrow: 0 }}>
        <Grid container spacing={4} justifyContent="center" alignItems="center">
          <Grid item xs={12} sm={5}>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DateTimePicker
                label="Start Date & Time"
                value={startDateTime}
                onChange={(newValue) => setStartDateTime(newValue)}
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
                onChange={(newValue) => setEndDateTime(newValue)}
                renderInput={(params) => <TextField fullWidth {...params} />}
                minDateTime={startDateTime || minDate}
                maxDateTime={maxDate}
              />
            </LocalizationProvider>
          </Grid>
          <Grid item xs={12} sm={2}>
            <Button
              variant="contained"
              color="primary"
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
      {/* Data + Charts */}
      <Box
        sx={{
          flexGrow: 1,
          maxWidth: 1200,
          margin: "2rem auto 0",
          width: "100%",
          display: "flex",
          flexDirection: "row",
          gap: 4,
        }}
      >
        {/* Left side: reduced-width data grid */}
        <Box sx={{ flexBasis: 0.6, maxWidth: 800, bgcolor: "white", p: 2, borderRadius: 2 }}>
          <DataGrid rows={rows} columns={columns} pageSize={10} autoHeight />
        </Box>
        {/* Right side: Pie Chart */}
        <Box sx={{ width: 400, bgcolor: "white", borderRadius: 2, p: 2 }}>
          <PieChart width={400} height={400}>
            <Pie
              data={pieData}
              cx="50%"
              cy="50%"
              outerRadius={120}
              fill="#8884d8"
              dataKey="value"
              label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
            >
              {pieData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend verticalAlign="bottom" height={36} />
          </PieChart>
        </Box>
      </Box>
    </Box>
  );
}
