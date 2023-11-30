import React, { createContext, useState } from 'react';

export const CSVDataContext = createContext();

export const CSVDataProvider = ({ children }) => {
  const [csvData, setCSVData] = useState([ { city_name: 'City 1', date: '01/01/2022', temperature: 25, humidity: 60, wind_speed: 5 },
]);

  const updateCSVData = (data) => {
    setCSVData(data);
  };

  return (
    <CSVDataContext.Provider value={{ csvData, updateCSVData }}>
      {children}
    </CSVDataContext.Provider>
  );
};
