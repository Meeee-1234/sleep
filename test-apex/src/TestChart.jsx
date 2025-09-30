import React from "react";
import Chart from "react-apexcharts";

export default function TestChart() {
  const series = [{ name: "Test", data: [10, 20, 30] }];
  const options = { chart: { id: "test-chart" }, xaxis: { categories: ["A", "B", "C"] } };

  return <div style={{ background: "#fff", padding: "20px" }}>
    <Chart options={options} series={series} type="line" height={300} />
  </div>;
}
