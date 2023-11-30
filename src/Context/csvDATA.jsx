import React, { createContext, useState } from 'react';

export const CSVDataContext = createContext();

export const CSVDataProvider = ({ children }) => {
  const [csvData, setCSVData] = useState([]);

  const updateCSVData = (data) => {
    setCSVData(data);
  };

  return (
    <CSVDataContext.Provider value={{ csvData, updateCSVData }}>
      {children}
    </CSVDataContext.Provider>
  );
};
