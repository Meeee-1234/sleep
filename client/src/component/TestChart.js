import React from "react";
import Chart from "react-apexcharts";

export default function TestChart({ data }) {
  // data = [{ date: '2025-09-18', quality: 80 }, ...]
  const series = [{
    name: "Sleep Quality",
    data: data.map(item => item.quality)
  }];

  const options = {
    chart: { id: "sleep-quality-chart" },
    xaxis: { categories: data.map(item => item.date) },
    yaxis: { min: 0, max: 20, title: { text: "Quality (%)" } },
    stroke: { curve: "smooth" },
    title: { text: "Weekly Sleep Quality", align: "center" }
  };

  return (
    <div style={{ background: "white", padding: "1rem", borderRadius: "15px" }}>
      <Chart options={options} series={series} type="line" height={300} />
    </div>
  );
}
