import { CSVDataContext } from '../Context/csvDATA';
import { useContext, useEffect, useState } from 'react';
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';
import WeatherRecord from './WeatherRecord';

function WeatherData() {
    const { csvData } = useContext(CSVDataContext);
    const [selectedCity, setSelectedCity] = useState('All'); 
    const [showData, setShowData] = useState(csvData);
    const [DateData, setDateData] = useState(csvData);
    const [uniqueCities, setuniqueCities] = useState(WeatherRecord.getUniqueCities(csvData));
    const [FilterData, setFilterData] = useState(showData);
    const [highestAvgTemp, sethighestAvgTemp] = useState(WeatherRecord.findHighestAverageTemperature(showData));
    const [averageTemperature, setaverageTemperature] = useState(WeatherRecord.calculateAverageTemperature(FilterData));
    const [averageHumidity, setaverageHumidity] = useState(WeatherRecord.calculateAverageHumidity(FilterData));
    const [averageWindSpeed, setaverageWindSpeed] = useState(WeatherRecord.calculateAverageWindSpeed(FilterData));
    var { earliestDate, oldestDate } = WeatherRecord.findEarliestAndOldestDates(csvData);
    const [startDate, setStartDate] = useState(earliestDate.toLocaleDateString('en-GB'));
    const [endDate, setEndDate] = useState(oldestDate.toLocaleDateString('en-GB'));

    useEffect(()=>{
        setShowData(csvData);
        setuniqueCities(WeatherRecord.getUniqueCities(csvData));
        setaverageTemperature(WeatherRecord.calculateAverageTemperature(csvData));
        sethighestAvgTemp(WeatherRecord.findHighestAverageTemperature(csvData));
        setaverageHumidity(WeatherRecord.calculateAverageHumidity(csvData));
        setaverageWindSpeed(WeatherRecord.calculateAverageWindSpeed(csvData));
        setStartDate(earliestDate.toLocaleDateString('en-GB'));
        setEndDate(oldestDate.toLocaleDateString('en-GB'));
        setDateData(csvData);
       setFilterData(showData);

    },[csvData])

    useEffect(() => {
          
        setFilterData(showData);

    }, [showData]);
     useEffect(()=>{
      
    setaverageTemperature(WeatherRecord.calculateAverageTemperature(FilterData));
    setaverageHumidity(WeatherRecord.calculateAverageHumidity(FilterData));
    setaverageWindSpeed(WeatherRecord.calculateAverageWindSpeed(FilterData));
     },[FilterData])

    useEffect(() => {
          
      sethighestAvgTemp(WeatherRecord.findHighestAverageTemperature(DateData));

  }, [DateData]);

    useEffect(() => {
    
        setFilterData( WeatherRecord.getDataByDateRange(showData, startDate, endDate));
        setDateData( WeatherRecord.getDataByDateRange(csvData, startDate, endDate));
      
    }, [startDate , endDate]);
    
    const handleCityChange = (event) => {
        setShowData(WeatherRecord.getDataByCity(csvData, event.target.value));
        setSelectedCity(event.target.value)
    };
          
    const handleChange = (newValues) => {
            
            const totalDays = (oldestDate.getTime() - earliestDate.getTime()) / (1000 * 3600 * 24);
        const newStartDays = Math.floor((totalDays * newValues[0]) / 100);
        const newEndDays = Math.floor((totalDays * newValues[1]) / 100);
    
        const newStartDate = new Date(earliestDate.getTime() + newStartDays * (1000 * 3600 * 24));
        const newEndDate = new Date(earliestDate.getTime() + newEndDays * (1000 * 3600 * 24));
          
        setStartDate(newStartDate.toLocaleDateString('en-GB'));
        setEndDate(newEndDate.toLocaleDateString('en-GB'));
       
      };
    

    return (
      <div>
     <div className='flex p-6'>
         <h3>Select a City:</h3>
         <select value={selectedCity} onChange={handleCityChange} className='border-2 bg-gray-500 bg-opacity-40 mx-4'>
        <option value="">Select a city</option>
        {uniqueCities.map((city, index) => (
          <option key={index} value={city}>
            {city}
          </option>
        ))}
        </select>
        <div className='flex'>
        <p>{startDate}</p>
        <Slider range defaultValue={[0, 365]} allowCross={false} onChange={handleChange} className='w-32 mx-6' />
        <p>{endDate}</p>
        </div>
      </div>
      <p>Data from:  {earliestDate.toLocaleDateString('en-GB')} to : {oldestDate.toLocaleDateString('en-GB')}</p>
        <div>
          <h3>Data for {selectedCity}:</h3>
          <div className={`flex justify-between flex-container`}>
          <div className="h-60 min-w-fit overflow-y-auto rounded-xl bg-gray-300 bg-opacity-50">
          <ul className="list-decimal w-full px-2">
        <li className='flex w-full pl-4'>
        <span className="font-semibold w-16">Index:</span>
        <span className="font-semibold w-28">City:</span>
        <span className="font-semibold w-32">Date: </span>
        <span className="font-semibold w-28">Temperature: </span>
        <span className="font-semibold w-20">Humidity: </span>
        <span className="font-semibold pl-2 w-28">Wind Speed: </span>    
             </li>
  {FilterData.map((record, index) => (
    <li key={index} className="pl-4 hover:bg-gray-500 hover:rounded-lg hover:bg-opacity-50">
      <div className="flex">
        <span className="font-semibold w-16">{index}</span>
        <span className=" w-28">{record.city_name} </span>
        <span className=" w-32">{record.date}</span>
        <span className="flex justify-between w-28">
            <span className='pl-4'>{record.temperature}</span>
            <span className='pr-8 font-semibold'>°C</span>
        </span>
        <span className="flex justify-between w-20">
            <span className='pl-2'>{record.humidity}</span>
            <span className='pr-4 font-semibold'>%</span>
        </span>
        <span className="flex justify-between w-28">
            <span className='pl-2'>{record.wind_speed}</span>
            <span className='pr-2 font-semibold'>km/h</span>
        </span>
      </div>
    </li>
  ))}
</ul>

          </div>
        <div className='mx-2 max-w-5/12 min-w-fit'>
          <h1 className='min-w-100 max-w-full'>Average Temp: {averageTemperature.toFixed(2)}</h1>
          <h1>Average Humidity: {averageHumidity.toFixed(2)}</h1>
          <h1>Average WindSpeed:  {averageWindSpeed.toFixed(2)}</h1>
          <h1>Highest Average Temperature by Date Range: {highestAvgTemp.highestAverageTemp.toFixed(2)} in {highestAvgTemp.city}</h1>

        </div>
        </div>
        </div>

  
      
      </div>
    );
  }
  

export default WeatherData;
