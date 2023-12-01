import React from 'react';

import { Chart as ChartJs, LineElement, TimeScale, LinearScale, PointElement, Tooltip, Legend } from 'chart.js';

import 'chartjs-adapter-date-fns';

import { Line } from 'react-chartjs-2';

ChartJs.register(
    LineElement, 
    TimeScale, 
    LinearScale,
    PointElement, 
    Tooltip, 
    Legend
);

const TemperatureGraph = ({dates, temperatures}) => {
    
    console.log({dates});
    if (!Array.isArray(dates) || !Array.isArray(temperatures)) {
        return null; // Return null or handle the case when data is not in the expected format
      }
    
      // Create an array of objects containing date and temperature pairs
      const datas = dates.map((date, index) => ({
        date,
        temperature: temperatures[index],
      }));
    
      // Sort the data array by date in ascending order
      datas.sort((a, b) => {
        const dateA = new Date(a.date);
        const dateB = new Date(b.date);
        return dateA - dateB;
      });
    
      // Separate the sorted dates and temperatures
      const sortedDates = datas.map((item) => item.date);
      const sortedTemperatures = datas.map((item) => item.temperature);
    

  const data = {
    labels: sortedDates,
    datasets: [
      {
        label: 'Temperature',
        data: sortedTemperatures,
        fill: false,
        backgroundColor: 'aqua',
        borderColor: 'rgb(75, 192, 192)',
        tension: 0,
      },
    ],
  };

  const options = {
    scales:{
        x:{
            type : 'time',
            time:{
                unit: 'month'
            }

        },
        y:{
            beginAtZero: true,

        }
    }
  };

  return (
    <div className=' h-96'>
      
      <h2>Temperature Graph</h2>
      
      <Line 
      data={data} 
      options={options} >

      </Line>
    </div>
  );
};

export default TemperatureGraph;
