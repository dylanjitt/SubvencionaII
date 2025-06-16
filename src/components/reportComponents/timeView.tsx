
import React, { useMemo } from "react";
import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  TimeScale,
  Title,
  Tooltip,
  Legend,
  SubTitle,
  ChartOptions
} from "chart.js";
import "chartjs-adapter-date-fns";
import { Line } from "react-chartjs-2";

// register all the bits we need
ChartJS.register(
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  TimeScale,
  Title,
  SubTitle,
  Tooltip,
  Legend
);

interface TimePointChartProps {
  dataValues?: number[];      // optional override
}

export default function TimePointChart({ dataValues }: TimePointChartProps) {
  // 1) build the 15‑min labels from 00:00 → 23:45
  const labels = useMemo(() => {
    const out: Date[] = [];
    const day = new Date();
    day.setHours(0, 0, 0, 0);
    for (let i = 0; i < 96; i++) {
      out.push(new Date(day.getTime() + i * 15 * 60 * 1000));
    }
    return out;
  }, []);

  // 2) random data if none passed
  const data = useMemo(() => {
    const vals =
      dataValues && dataValues.length === labels.length
        ? dataValues
        : labels.map(() => Math.floor(Math.random() * 80) - 20);
    return {
      labels,
      datasets: [
        {
          label: "My 15‑min series",
          data: vals,
          fill: false,
          borderColor: "#ff6384",
          borderWidth: 2,
          tension: 0.3,
          // Point styling from the Chart.js “Point Styling” sample:
          pointStyle: "circle",
          pointRadius: 6,
          pointBackgroundColor: "#ff6384",
          pointBorderColor: "#fff",
          pointBorderWidth: 2,
          pointHoverRadius: 10
        }
      ]
    };
  }, [labels, dataValues]);

  const options: ChartOptions<"line"> = {
    responsive: true,
    plugins: {
      title: {
        display: true,
        text: "15‑Minute Interval Data",
        font: { size: 18 }
      },
      subtitle: {
        display: true,
        text: "Point Styling Example with Time Scale",
        font: { size: 12 },
        padding: { bottom: 10 }
      },
      legend: { display: false }
    },
    scales: {
      x: {
        type: "time",
        time: {
          unit: "hour",          // uses the TimeUnit type
          //stepSize: 1,
          displayFormats: { hour: "HH:mm" }
        },
        title: { display: true, text: "Time of Day" }
      },
      y: {
        beginAtZero: true,
        title: { display: true, text: "Value" },
        //grid: { drawBorder: false }
      }
    }
  };
  

  return <Line options={options} data={data} />;
}
