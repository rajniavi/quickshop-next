"use client";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend
);

export default function AdminOrdersChart({ labels, values }) {
  return (
    <Bar
      data={{
        labels,
        datasets: [
          {
            label: "Orders",
            data: values,
            backgroundColor: "#0d6efd",
          },
        ],
      }}
      options={{
        responsive: true,
        plugins: {
          legend: { display: false },
        },
      }}
    />
  );
}