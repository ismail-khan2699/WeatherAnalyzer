import React from 'react';
import CSVReader from './components/CsvReader';
import { CSVDataContext } from './Context/csvDATA';
import WeatherData from './components/WeatherData';

function App() {
  const { csvData, } = React.useContext(CSVDataContext);

  return (
    <div>
      <h1 className='text-xl p-10 underline'>Parse Data</h1>
      <CSVReader />
      {csvData && csvData.length > 1 ? <WeatherData/> : null}
      
    </div>
  );
}

export default App;
