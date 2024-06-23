import React from 'react';
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

// Đăng ký các thành phần của Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const BarChart = ({ header, chartData, time }) => {
  let backgroundColor = [];

  if (header === "aqi") {
    for (let i = 0; i < chartData?.length; i++) {
      if (chartData[i] <= 50) {
        backgroundColor.push('rgb(0, 228, 0)');
      } else if (chartData[i] <= 100) {
        backgroundColor.push('rgb(255, 255, 0)');
      } else if (chartData[i] <= 150) {
        backgroundColor.push('rgb(255, 126, 0)');
      } else if (chartData[i] <= 200) { 
        backgroundColor.push('rgb(255, 0, 0)');
      } else if (chartData[i] <= 300) {
        backgroundColor.push('rgb(143, 63, 151)');
      } else {
        backgroundColor.push('rgb(126, 0, 35)');
      }
    }
  } else if (header === "ppm") {
    for (let i = 0; i < chartData?.length; i++) {
      if (chartData[i] < 50.0) {
        backgroundColor.push('rgba(0, 128, 0, 0.2)');
      } else if (chartData[i] < 100) {
        backgroundColor.push('rgba(255, 255, 0, 0.2)');
      } else {
        backgroundColor.push('rgba(255, 0, 0, 0.2)');
      }
    }
  } else {
    backgroundColor = new Array(chartData.length).fill('rgba(75, 192, 192, 0.2)');
  }

  const data = {
    labels: time,
    datasets: [
      {
        label: header,
        data: chartData,
        backgroundColor: backgroundColor,
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
      },
    ],
  };

  const options = {
    scales: {
      y: {
        beginAtZero: true,
      },
    },
    plugins: {
      tooltip: {
        callbacks: {
          label: function(context) {
            let label = context.dataset.label.toUpperCase()+' level' || '';
            if (context.dataset.label) {
              label += ': ';
            }
            if (header === 'aqi') {
              label += context.raw > 300 ?context.raw+ ' Hazardous' :
                       context.raw > 200 ? context.raw+' Very Bad' :
                       context.raw > 150 ? context.raw+' Bad' :
                       context.raw > 100 ?context.raw+ ' Not Good' :
                       context.raw > 50 ? context.raw+' Moderate' :
                       context.raw >= 0 ?context.raw+ ' Good' : '';
            } else {
              label += context.raw + ' ppm';
            }
            return label;
          }
        }
      }
    },
    legend: {
      display: false,
    },
  };
  if(chartData)
  return (
    <div className="chart-container">
      <Bar data={data} options={options} width={400} height={250} />
    </div>
  );
};

export default BarChart;
