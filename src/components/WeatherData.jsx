import { CSVDataContext } from '../Context/csvDATA';
import { useContext, useEffect, useState } from 'react';
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';
import WeatherRecord from './WeatherRecord';
import TemperatureGraph from './ChartComponent';


function WeatherData() {
    const { csvData } = useContext(CSVDataContext);
    const [selectedCity, setSelectedCity] = useState(""); 
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
    const [allDates, setAllDates] = useState(WeatherRecord.getDatesFromCsvData(FilterData));
    const [allTemp, setAllTemp] = useState(WeatherRecord.getTemperaturesFromCsvData(FilterData));
    const [allHumidity, setAllHumidity] = useState(WeatherRecord.getHumidityFromCsvData(FilterData));
    const [allWindspeed, setAllWindspeed] = useState(WeatherRecord.getWindspeedFromCsvData(FilterData));

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
    setAllDates(WeatherRecord.getDatesFromCsvData(FilterData));
    setAllTemp(WeatherRecord.getTemperaturesFromCsvData(FilterData));
    setAllHumidity(WeatherRecord.getHumidityFromCsvData(FilterData));
   setAllWindspeed(WeatherRecord.getWindspeedFromCsvData(FilterData));

     },[FilterData])

    useEffect(() => {
          
      sethighestAvgTemp(WeatherRecord.findHighestAverageTemperature(DateData));

  }, [DateData]);

    useEffect(() => {
    
        setFilterData( WeatherRecord.getDataByDateRange(showData, startDate, endDate));
        setDateData( WeatherRecord.getDataByDateRange(csvData, startDate, endDate));
      
    }, [startDate , endDate]);
    
    const handleCityChange = (event) => {
    const selectedValue = event.target.value;
    console.log({selectedValue});
    setShowData(WeatherRecord.getDataByCity(csvData, selectedValue));
    setSelectedCity(selectedValue);
};

    const formatDates = (dates) => {
      return dates.map((dateString) => {
        const [day, month, year] = dateString.split('/');
        return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
      });
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
      <div className='flex'>
    
        <div className='w-3/4 p-4'>
     {selectedCity ==="" ?  <h3 className='px-6 py-4 my-2 text-xl text-white bg-red-600 hover:bg-red-200 hover:text-blue-700 bg-opacity-60 rounded-lg items-center justify-center font-serif'>Data form All Cities</h3> 
     :
       <h3 className='px-6 py-4 my-2 text-xl text-white bg-red-600 hover:bg-red-200 hover:text-blue-700 bg-opacity-60 rounded-lg items-center justify-center font-serif'>Data for {selectedCity}:</h3> }  
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
        <div className='mx-2 min-w-fit'>
          <h1 className='min-w-100 max-w-full py-2 my-5 text-xl font-semibold hover:font-bold hover:underline hover:decoration-emerald-500 '>Average Temp: {averageTemperature.toFixed(2)}</h1>
          <h1 className='min-w-100 max-w-full py-2 my-5 text-xl font-semibold hover:underline hover:decoration-emerald-500 hover:font-bold'>Average Humidity: {averageHumidity.toFixed(2)}</h1>
          <h1 className='min-w-100 max-w-full py-2 my-5 text-xl font-semibold hover:underline hover:decoration-emerald-500 hover:font-bold'>Average WindSpeed:  {averageWindSpeed.toFixed(2)}</h1>
        </div>
        </div>
        {selectedCity ==="" ? <p className='bg-red-100 my-10 rounded-lg px-10 font-mono font-bold bg-opacity-50 py-5 items-center justify-center mx-20'>
          Please Select a City to see Graph !</p>
          
          :
        
        <div className='max-w-auto h-fit min-w-screen-sm'>
        <TemperatureGraph dates={formatDates(allDates)} temperatures={allTemp} label1={'Temperature'} color={'#22092C'} bgc={'#872341'}/>
        <TemperatureGraph dates={formatDates(allDates)} temperatures={allHumidity} label1={'Humidity'} color={'#EC8F5E'} bgc={'#F1EB90'}/>
        <TemperatureGraph dates={formatDates(allDates)} temperatures={allWindspeed} label1={'Wind Speed'} color={'aqua'} bgc={'#2D9596'}/>
        </div>
        }
        
        </div>
        <div className='p-6 w-1/4 bg-slate-100 m-4 rounded-lg h-screen'>
         <h3 className=' font-semibold'>Filter by City:</h3>
         <select value={selectedCity} onChange={handleCityChange} className='border-3 bg-gray-600 rounded-md m-4 bg-opacity-40 mx-4'>
        <option className='hover:underline hover:divide-emerald-400' value="">ALL</option>
        {uniqueCities.map((city, index) => (
          <option key={index} value={city}>
            {city}
          </option>
        ))}
        </select>
        <h3 className=' py-4 my-2 font-semibold'>Filter By Range: </h3>
        <div class="flex items-center justify-center">
        <Slider range defaultValue={[0, 365]} allowCross={false} onChange={handleChange} className=' w-48'/>
        </div>
        <div className='my-4 flex justify-between'>
        <p>{startDate}</p>
        <p>{endDate}</p>
        </div>
        <h1 className=' font-semibold my-6'>Highest Average Temperature by Date Range: <br/> <span className='hover:font-bold hover:underline font-mono font-semibold hover:decoration-emerald-400 m-4 p-4'>{highestAvgTemp.highestAverageTemp.toFixed(2)} in {highestAvgTemp.city}</span></h1>
      </div>
      </div>
    );
  }
  

export default WeatherData;
