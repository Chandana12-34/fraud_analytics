import React, { useState } from "react";
import { Box, Typography, Grid, TextField, Button } from "@mui/material";
import { LocalizationProvider, DateTimePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import { DataGrid } from "@mui/x-data-grid";
import { PieChart, Pie, Cell, Legend, Tooltip } from "recharts";
import "./App.css"; // Import the css file

const columns = [
  { field: "CustomerID", headerName: "Customer ID", width: 130 },
  { field: "CustomerName", headerName: "Customer Name", width: 150 },
  { field: "TransactionID", headerName: "Transaction ID", width: 150 },
  { field: "Address", headerName: "Address", width: 180 },
  { field: "MerchantID", headerName: "Merchant ID", width: 130 },
  { field: "FraudPercentage", headerName: "Fraud Percentage", width: 150 },
];

// Example static PieChart data
const pieData = [
  { name: "Fraudulent", value: 30 },
  { name: "Non-Fraudulent", value: 70 },
];

const COLORS = ["#e63946", "#4caf50"]; // red and green

function App() {
  const [startDateTime, setStartDateTime] = useState(null);
  const [endDateTime, setEndDateTime] = useState(null);
  const [rows, setRows] = useState([]);

  const minDate = dayjs("2000-01-01T00:00:00");
  const maxDate = dayjs("2040-12-31T23:59:59");

  const handleFilterClick = () => {
    console.log("Filter applied:", startDateTime?.toString(), endDateTime?.toString());
    // Implement filtering functionality if needed
  };

  return (
    <Box className="app-container">
      <Box className="app-content">
        <Typography variant="h3" component="h1" className="app-header">
          Real Time Data Analytics
        </Typography>

        <Box className="filters-container">
          <Grid container spacing={4} justifyContent="center" alignItems="center">
            <Grid item xs={12} sm={5}>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DateTimePicker
                  label="Start Date & Time"
                  value={startDateTime}
                  onChange={setStartDateTime}
                  renderInput={(params) => (
                    <TextField
                      fullWidth
                      {...params}
                      InputLabelProps={{ className: "date-picker-label" }}
                      InputProps={{ className: "date-picker-input" }}
                    />
                  )}
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
                  renderInput={(params) => (
                    <TextField
                      fullWidth
                      {...params}
                      InputLabelProps={{ className: "date-picker-label" }}
                      InputProps={{ className: "date-picker-input" }}
                    />
                  )}
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
                className="filter-button"
              >
                Filter
              </Button>
            </Grid>
          </Grid>
        </Box>

        <Box className="data-chart-container">
          <Box className="data-grid-container">
            <DataGrid rows={rows} columns={columns} pageSize={10} autoHeight />
          </Box>

          <Box className="pie-chart-container">
            <PieChart width={400} height={400}>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                outerRadius={120}
                fill="#8884d8"
                dataKey="value"
                label={({ name, percent }) =>
                  `${name}: ${(percent * 100).toFixed(0)}%`
                }
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
    </Box>
  );
}

export default App;
