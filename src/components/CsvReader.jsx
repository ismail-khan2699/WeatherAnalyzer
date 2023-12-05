import React, { useEffect, useState, useContext } from 'react';
import Papa from 'papaparse';
import { CSVDataContext } from '../Context/csvDATA';
import WeatherRecord from './WeatherRecord';

function CSVReader() {
    const { csvData, updateCSVData } = useContext(CSVDataContext);
    const [errorMessage, setErrorMessage] = useState('');

    const handleFileUpload = (event) => {
      const file = event.target.files[0];
      if (file) {
        Papa.parse(file, {
          header: true,
          dynamicTyping: true,
          complete: (result) => {
            const data = result.data;
            const requiredFields = ['city_name', 'date', 'temperature', 'humidity', 'wind_speed'];
            const csvHeader = Object.keys(data[0]);
            const missingFields = requiredFields.filter(field => !csvHeader.includes(field));
            
            if (missingFields.length > 0) {
              setErrorMessage(`Missing fields in CSV: ${missingFields.join(' , ')}`);
              updateCSVData([]);
            } else {
              const parsedData = validateAndFormatDate(data);
              const sortedData = parsedData.sort((a, b) => new Date(a.date) - new Date(b.date));
              updateCSVData(sortedData);
            }
          },
          error: (error) => {
            console.error('Error:', error);
            setErrorMessage('Error parsing the CSV file.');
            setCSVData([]);
          }
        });
      }
    };
    
    const validateAndFormatDate = (data) => {
      const currentDate = new Date();
    
      return data.map(record => {
        let parsedDate = WeatherRecord.parseDate(record.date);
    
        // Check if date is in mm/dd or dd/mm format and adjust
        if (isNaN(parsedDate.getTime())) {
          const dateParts = record.date.split(/[/-]/);
          const possibleYear = dateParts[dateParts.length - 1];
          const year = possibleYear.length === 4 ? possibleYear : currentDate.getFullYear();
          const possibleMonth = parseInt(dateParts[0], 10);
          const possibleDay = parseInt(dateParts[1], 10);
    
          if (possibleMonth <= 12 && possibleDay <= 31) {
            parsedDate = new Date(year, possibleMonth - 1, possibleDay);
          }
        }
    
        // Format date as dd/mm/yyyy
        const formattedDate = `${parsedDate.getDate().toString().padStart(2, '0')}/${(parsedDate.getMonth() + 1).toString().padStart(2, '0')}/${parsedDate.getFullYear()}`;
    
        return { ...record, date: formattedDate };
      });
    };
    
    
  useEffect(()=>{

    setErrorMessage('');

  },[handleFileUpload])
    return (
      <div className=' pt-4 mt-6'>
        <input type="file" onChange={handleFileUpload} />
        {errorMessage && <p className=' text-xl bg-white'>Error: {errorMessage}</p>}
        <div>
        {csvData && csvData.length > 1 ? <p className=' text-green-600 text-lg bg-slate-50 bg-opacity-40 my-2 mr-10 pl-3'>File Entered !</p> : null}
        </div>
      </div>
    );
  }
  
  export default CSVReader;
  