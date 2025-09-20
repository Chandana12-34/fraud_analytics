import React, { useState, useEffect } from "react";
import { Box, Typography, Grid, TextField, Button } from "@mui/material";
import { LocalizationProvider, DateTimePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import { DataGrid } from "@mui/x-data-grid";
import { PieChart, Pie, Cell, Legend, Tooltip } from "recharts";
import axios from "axios";
import "./App.css";

// Columns for DataGrid
const columns = [
  { field: "customerid", headerName: "Customer ID", width: 130 },
  { field: "name", headerName: "Customer Name", width: 150 },
  { field: "transactionid", headerName: "Transaction ID", width: 150 },
  { field: "address", headerName: "Address", width: 180 },
  { field: "merchantid", headerName: "Merchant ID", width: 130 },
  { field: "fraudindicator", headerName: "Fraud", width: 120 },
];

// Colors for Pie chart
const COLORS = {
  Fraudulent: "#e63946",
  "Non-Fraudulent": "#4caf50",
};

function App() {
  const [startDateTime, setStartDateTime] = useState(null);
  const [endDateTime, setEndDateTime] = useState(null);
  const [rows, setRows] = useState([]);
  const [pieData, setPieData] = useState([]);
  const [loading, setLoading] = useState(false);

  const minDate = dayjs("2000-01-01T00:00:00");
  const maxDate = dayjs("2040-12-31T23:59:59");

  // Fetch all data initially
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = (start, end) => {
    setLoading(true);
    let url = "http://127.0.0.1:8000/data";
    if (start && end) {
      url += `?start=${start.toISOString()}&end=${end.toISOString()}`;
    }

    axios
      .get(url)
      .then((res) => {
        const formattedRows = res.data.data.map((row, i) => ({ id: i, ...row }));
        setRows(formattedRows);

        const fraudulentCount = res.data.data.filter((t) => t.fraudindicator).length;
        const nonFraudulentCount = res.data.data.length - fraudulentCount;
        setPieData([
          { name: "Fraudulent", value: fraudulentCount },
          { name: "Non-Fraudulent", value: nonFraudulentCount },
        ]);
      })
      .catch((err) => console.error("Error fetching data:", err))
      .finally(() => setLoading(false));
  };

  const handleFilterClick = () => {
    if (!startDateTime || !endDateTime) return;
    fetchData(startDateTime, endDateTime);
  };

  return (
    <Box className="app-container">
      <Box className="app-content">
        <Typography variant="h3" component="h1" align="center" gutterBottom>
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
                disabled={!startDateTime || !endDateTime || loading}
              >
                {loading ? "Loading..." : "Filter"}
              </Button>
            </Grid>
          </Grid>
        </Box>

        {/* Pie Chart */}
        <Box mt={4} display="flex" justifyContent="center" alignItems="center">
          <PieChart width={400} height={400}>
            <Pie
              data={pieData}
              cx="50%"
              cy="50%"
              outerRadius={120}
              dataKey="value"
              label
            >
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
          <DataGrid
            rows={rows}
            columns={columns}
            pageSize={10}
            rowsPerPageOptions={[5, 10, 25]}
            autoHeight
            loading={loading}
          />
        </Box>
      </Box>
    </Box>
  );
}

export default App;
