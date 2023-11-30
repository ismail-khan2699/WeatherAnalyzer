import { CSVDataContext } from '../Context/csvDATA';
import { useContext, useEffect, useState } from 'react';
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';

class WeatherRecord {
  constructor(city_name, date, temperature, humidity, wind_speed) {
    this.city_name = city_name;
    this.date = date;
    this.temperature = temperature;
    this.humidity = humidity;
    this.wind_speed = wind_speed;
  }

  static parseDate(dateString) {
    const dateParts = dateString.split(/[/-]/);
    let day = parseInt(dateParts[0], 10);
    let month = parseInt(dateParts[1], 10);
    let year = dateParts.length === 3 ? parseInt(dateParts[2], 10) : new Date().getFullYear();
  
    // Adjusting the year if the format is dd/mm or dd/mm/yy
    if (dateParts.length <= 2) {
      const currentYear = new Date().getFullYear();
      year = parseInt(currentYear.toString().slice(0, 2) + dateParts[2], 10);
      year = year > currentYear ? year - 100 : year;
    }
  
    return new Date(year, month - 1, day);
  }
  

  static getDataByDateRange(csvData, startDate, endDate) {
    const start = this.parseDate(startDate);
    const end = this.parseDate(endDate);
    
    return csvData.filter((record) => {
      const currentDate = this.parseDate(record.date);
      return currentDate >= start && currentDate <= end;
    });
  }

  static getDataByCity(csvData, cityName) {
    if (!cityName) {
      return csvData;
    }
  
    const filteredData = csvData.filter(record => record.city_name === cityName);
    return filteredData.length > 0 ? filteredData : null;
  }
  

  static getUniqueCities(csvData) {
    return [...new Set(csvData.map(record => record.city_name))];
  }

  static findEarliestAndOldestDates(csvData) {

    let earliestDate = this.parseDate(csvData[0].date);
    let oldestDate = this.parseDate(csvData[0].date);

    csvData.forEach((record) => {
      const currentDate = this.parseDate(record.date);

      if (currentDate < earliestDate) {
        earliestDate = currentDate;
      }

      if (currentDate > oldestDate) {
        oldestDate = currentDate;
      }
    });

    return { earliestDate, oldestDate };
  };
  static calculateAverageTemperature = (data) => {
    const totalTemperature = data.reduce((acc, record) => acc + record.temperature, 0);
    return totalTemperature / data.length;
  };
  static calculateAverageHumidity = (data) => {
    const totalhumidity = data.reduce((acc, record) => acc + record.humidity, 0);
    return totalhumidity / data.length;
  };
  static calculateAverageWindSpeed = (data) => {
    const totalwind_speed = data.reduce((acc, record) => acc + record.wind_speed, 0);
    return totalwind_speed / data.length;
  };

  static findHighestAverageTemperature(data) {
    const cities = {};
  
    // Calculate average temperature for each city
    data.forEach((record) => {
      if (!cities[record.city_name]) {
        cities[record.city_name] = { totalTemp: 0, count: 0 };
      }
      cities[record.city_name].totalTemp += record.temperature;
      cities[record.city_name].count++;
    });
  
    // Calculate averages and find the highest
    let highestAverage = 0;
    let cityWithHighestAverage = '';
  
    for (const city in cities) {
      const avgTemp = cities[city].totalTemp / cities[city].count;
      if (avgTemp > highestAverage) {
        highestAverage = avgTemp;
        cityWithHighestAverage = city;
      }
    }
  
    return { city: cityWithHighestAverage, highestAverageTemp: highestAverage };
  }
  

}

function WeatherData() {
    const { csvData } = useContext(CSVDataContext);
    const [selectedCity, setSelectedCity] = useState('All'); 
    const [showData, setShowData] = useState(csvData);
    const [uniqueCities, setuniqueCities] = useState(WeatherRecord.getUniqueCities(csvData));
    const [averageTemperature, setaverageTemperature] = useState(WeatherRecord.calculateAverageTemperature(csvData));
    const [highestAvgTemp, sethighestAvgTemp] = useState(WeatherRecord.findHighestAverageTemperature(csvData));
    const [averageHumidity, setaverageHumidity] = useState(WeatherRecord.calculateAverageHumidity(csvData));
    const [averageWindSpeed, setaverageWindSpeed] = useState(WeatherRecord.calculateAverageWindSpeed(csvData));
    var { earliestDate, oldestDate } = WeatherRecord.findEarliestAndOldestDates(csvData);
    const [startDate, setStartDate] = useState(earliestDate.toLocaleDateString());
    const [endDate, setEndDate] = useState(oldestDate.toLocaleDateString());
    const [FilterData, setFilterData] = useState(showData);

    useEffect(()=>{
        setShowData(csvData);
        setuniqueCities(WeatherRecord.getUniqueCities(csvData));
        setaverageTemperature(WeatherRecord.calculateAverageTemperature(csvData));
        sethighestAvgTemp(WeatherRecord.findHighestAverageTemperature(csvData));
        setaverageHumidity(WeatherRecord.calculateAverageHumidity(csvData));
        setaverageWindSpeed(WeatherRecord.calculateAverageWindSpeed(csvData));
        setStartDate(earliestDate.toLocaleDateString());
        setEndDate(oldestDate.toLocaleDateString());
       setFilterData(showData);

    },[csvData])

    useEffect(() => {
          
        setFilterData(showData);


    }, [showData]);
    useEffect(() => {
    
        setFilterData( WeatherRecord.getDataByDateRange(showData, startDate, endDate));

      
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
      <Slider range defaultValue={[0, 365]} allowCross={false} onChange={handleChange} className='w-32' />
      <p>{endDate}</p>
    </div>
      </div>
    
        <div>
          <h3>Data for {selectedCity}:</h3>
          <ul>
            {FilterData.map((record, index) => (
              <li key={index}>
                City: {record.city_name}, Date: {record.date}, Temperature: {record.temperature}, Humidity: {record.humidity}, Wind Speed: {record.wind_speed}
              </li>
            ))}
          </ul>
        </div>

  
        <p>Earliest Date: {earliestDate.toLocaleDateString()}</p>
        <p>Oldest Date: {oldestDate.toLocaleDateString()}</p>
        <p>Average Temperature: {averageTemperature.toFixed(2)}</p>
        <p>Highest Average Temperature: {highestAvgTemp.highestAverageTemp.toFixed(2)} in {highestAvgTemp.city}</p>
      </div>
    );
  }
  

export default WeatherData;
