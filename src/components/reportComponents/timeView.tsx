
import { useMemo } from "react";
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
  type ChartOptions
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
  dataValues?: number[]; 
  title:string
}

export default function TimePointChart({ dataValues,title }: TimePointChartProps) {
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

  

  const data = useMemo(() => {

    return {
      labels,
      datasets: [
        {
          label: "My 15‑min series",
          data: dataValues,
          fill: false,
          borderColor: "#ff6384",
          borderWidth: 2,
          tension: 0.3,
          pointStyle: "circle",
          pointRadius: 5,
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
        text: title,
        font: { size: 18 }
      },
      subtitle: {
        display: false,
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
          unit: "hour",         
          //stepSize: 1,
          displayFormats: { hour: "HH:mm" }
        },
        title: { display: true, text: "Intervalos de 15 de horas en el día" }
      },
      y: {
        beginAtZero: true,
        title: { display: true, text: "Cantidad de Reservas" },
        //grid: { drawBorder: false }
      }
    }
  };
  

  return( 
    <div style={{ position: 'relative', height: '550px', width: '1100px' }}>
      <Line options={options} data={data} />
    </div>
  );
}
