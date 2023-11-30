import React from 'react';
import CSVReader from './components/CsvReader';
import { CSVDataContext } from './Context/csvDATA';

function App() {
  const { csvData, updateCSVData } = React.useContext(CSVDataContext);

  const handleButtonClick = () => {
    // Your logic to execute on button click
    console.log(csvData);
    // Add more logic or actions here
  };

  return (
    <div>
      <h1 className='text-xl p-10 underline'>Parse Data</h1>
      <button
        onClick={handleButtonClick}
        type="button"
        className="text-gray-900 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-200 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700"
      >
        Light
      </button>
      <CSVReader />
    </div>
  );
}

export default App;
