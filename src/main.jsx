import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { CSVDataProvider } from './Context/csvDATA.jsx'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <CSVDataProvider>
    <App />
    </CSVDataProvider>
  </React.StrictMode>,
)
