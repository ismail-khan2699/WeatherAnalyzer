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
    static getDatesFromCsvData = (csvData) => {
        return csvData.map((record) => record.date);
      };
      
      // Function to extract an array of temperatures from csvData
      static getTemperaturesFromCsvData = (csvData) => {
        return csvData.map((record) => record.temperature);
      };
  
  }

export default WeatherRecord;