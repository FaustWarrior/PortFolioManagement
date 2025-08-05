import { Line } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js'

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
)

const ChartSection = ({ chartData }) => {
  if (!chartData) {
    return (
      <div className="card">
        <h2>Stock Performance</h2>
        <p>Click "Chart" on any stock to view its historical performance</p>
        <div className="chart-container">
          <canvas style={{ height: '400px' }}></canvas>
        </div>
      </div>
    )
  }

  const data = {
    labels: chartData.labels,
    datasets: [
      {
        label: `${chartData.ticker} Closing Price`,
        data: chartData.values,
        borderColor: '#66CDAA',
        backgroundColor: 'rgba(102, 205, 170, 0.1)',
        borderWidth: 2,
        fill: true,
        tension: 0.4,
      },
    ],
  }

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      title: {
        display: true,
        text: `${chartData.ticker} Price History`,
        font: {
          size: 16,
          weight: 'bold',
        },
      },
      legend: {
        display: false,
      },
    },
    scales: {
      y: {
        beginAtZero: false,
        grid: {
          color: 'rgba(0,0,0,0.1)',
        },
      },
      x: {
        grid: {
          color: 'rgba(0,0,0,0.1)',
        },
      },
    },
  }

  return (
    <div className="card">
      <h2>Stock Performance</h2>
      <div className="chart-container">
        <Line data={data} options={options} />
      </div>
    </div>
  )
}

export default ChartSection