import { Doughnut } from "react-chartjs-2"


interface circleDataProps{
  tickets:number[],
  title:string
}

const CircleChart = ({tickets,title}:circleDataProps)=>{
  const colors = [
    '#FF6384', '#36A2EB', '#FFCE56',
    '#4BC0C0', '#9966FF', '#FF9F40',
    '#8AFF33', '#FF33A8', '#33FFD5',
    '#D533FF'
  ];

  

  let chartData = {
    labels: Array.from({ length: 10 }, (_, i) => `Station ${i + 1}`),
    datasets: [
      {
        data: tickets,
        backgroundColor:colors
      }
    ]
  };


  let chartOptions = {
    plugins: {
      title: {
        display: true,
        text: title,
        font: { size: 20 }
      },
      subtitle: {
        display: false,
        text: "Abril 1 - Hoy",
        font: { size: 14 },
        padding: { bottom: 10 }
      },
      legend: {
        position: "bottom" as const
      }
    }
  };
return( 
  <div style={{ position: 'relative', height: '550px', width: '100%' }}>
  <Doughnut data={chartData} options={chartOptions} />
</div>
)
}

export default CircleChart