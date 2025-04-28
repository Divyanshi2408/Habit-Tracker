import React from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale } from 'chart.js';

// Register chart components
ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale);

const HabitPerformanceChart = ({ habitData }) => {
  const dates = habitData.map(log => log.date);
  const completedDays = habitData.filter(log => log.status === 'completed').length;
  const missedDays = habitData.filter(log => log.status === 'missed').length;

  // Chart data
  const data = {
    labels: dates,
    datasets: [
      {
        label: 'Completed',
        data: habitData.map(log => (log.status === 'completed' ? 1 : 0)),
        backgroundColor: 'green',
      },
      {
        label: 'Missed',
        data: habitData.map(log => (log.status === 'missed' ? 1 : 0)),
        backgroundColor: 'red',
      },
    ],
  };

  // Chart options
  const options = {
    responsive: true,
    scales: {
      x: {
        title: {
          display: true,
          text: 'Date',
        },
      },
      y: {
        title: {
          display: true,
          text: 'Status',
        },
        beginAtZero: true,
      },
    },
  };

  return (
    <div>
      <Bar data={data} options={options} />
    </div>
  );
};

export default HabitPerformanceChart;
