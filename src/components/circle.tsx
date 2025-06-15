import { Card } from "@mui/material"
import { Doughnut } from "react-chartjs-2"
import type { ticketData } from "../interface/ticketDataInterface";

interface ticketList{
  tickets:ticketData[]
}
const CircleChart = ({tickets}:ticketList)=>{
  const colors = [
    '#FF6384', '#36A2EB', '#FFCE56',
    '#4BC0C0', '#9966FF', '#FF9F40',
    '#8AFF33', '#FF33A8', '#33FFD5',
    '#D533FF'
  ];

  // aggregate counts per station 1–10
  let countsByStation = Array.from({ length: 10 }, (_, i) => {
    const id = (i + 1).toString();
    return tickets.filter(t => t.gas_station_id === id).length;
  });

  let chartData = {
    labels: Array.from({ length: 10 }, (_, i) => `Station ${i + 1}`),
    datasets: [
      {
        data: countsByStation,
        backgroundColor:colors
      }
    ]
  };
  console.log(countsByStation)

  let chartOptions = {
    plugins: {
      title: {
        display: true,
        text: "Tickets by Gas Station",
        font: { size: 20 }
      },
      subtitle: {
        display: true,
        text: "April 1 – Today",
        font: { size: 14 },
        padding: { bottom: 10 }
      },
      legend: {
        position: "bottom" as const
      }
    }
  };
return(
  <Card>
    <Doughnut data={chartData} options={chartOptions} />
  </Card>
)
}

export default CircleChart