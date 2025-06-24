
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
  labels:string[];
  title:string;
}

export default function TimePointChart({ dataValues, labels, title }: TimePointChartProps) {
  const dateLabels = useMemo(() => {
    return labels.map(time => {
      const [hours, minutes] = time.split(':');
      const date = new Date();
      date.setHours(parseInt(hours), parseInt(minutes), 0, 0);
      return date;
    });
  }, [labels]);

  const data = useMemo(() => {
    return {
      labels: dateLabels,
      datasets: [
        {
          label: "Reservas por intervalo",
          data: dataValues?.map((value, index) => ({
            x: dateLabels[index], // Usar objeto Date como valor
            y: value // dato actual
          })),
          fill: false,
          borderColor: "#ff6384",
          borderWidth: 2,
          tension: 0.3,
          pointStyle: "circle",
          pointRadius: dataValues && dataValues.length > 96 ? 2 : 5,
          pointBackgroundColor: "#ff6384",
          pointBorderColor: "#fff",
          pointBorderWidth: 2,
          pointHoverRadius: 10
        }
      ]
    };
  }, [dateLabels, dataValues]);

  const options: ChartOptions<"line"> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      title: {
        display: true,
        text: title,
        font: { size: 18 }
      },
      legend: { display: false },
      tooltip: {
        callbacks: {
          title: (context) => {
            //label original
            return labels[context[0].dataIndex];
          },
          label: (context) => {
            return `Reservas: ${context.parsed.y}`;
          }
        }
      }
    },
    scales: {
      x: {
        type: "time",
        time: {
          unit: "hour",
          displayFormats: { 
            hour: "HH:mm",
            minute: "HH:mm"
          },
          tooltipFormat: 'HH:mm'
        },
        title: { display: true, text: "Intervalos de 15 minutos en el día" }
      },
      y: {
        beginAtZero: true,
        title: { display: true, text: "Cantidad de Reservas" },
      }
    }
  };

  return ( 
    <div style={{ position: 'relative',  minHeight: '350px', height:'100%', maxHeight:'400px',width:'100%',alignItems:'center',justifyContent:'center',display:'flex' }}>
      <Line options={options} data={data} width={undefined} height={undefined}/>
    </div>
  );
}