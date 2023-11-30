import React, { useEffect, useState, useContext } from 'react';
import Papa from 'papaparse';
import { CSVDataContext } from '../Context/csvDATA';

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
            
           
            const requiredFields = ['id', 'city-name', 'date', 'temperature', 'humidity', 'wind_speed'];
            const csvHeader = Object.keys(data[0]);
            const missingFields = requiredFields.filter(field => !csvHeader.includes(field));
  
            if (missingFields.length > 0) {
              setErrorMessage(`Missing fields in CSV: ${missingFields.join(', ')}`);
              updateCSVData([]);
            } else {
              setErrorMessage('');
              updateCSVData(data);
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
  useEffect(()=>{

console.log({csvData})

  },[csvData])
    return (
      <div>
        <input type="file" onChange={handleFileUpload} />
        {errorMessage && <p>Error: {errorMessage}</p>}
        <div>
          <h2>Parsed CSV Data:</h2>
          <pre>{JSON.stringify(csvData, null, 2)}</pre>
        </div>
      </div>
    );
  }
  
  export default CSVReader;
  