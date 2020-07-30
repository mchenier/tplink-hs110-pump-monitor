import React from 'react';
import Plotly from "plotly.js-basic-dist";
import createPlotlyComponent from "react-plotly.js/factory";
import Papa from 'papaparse'
import data from './assets/device_graph.csv'

import './App.css';

const Plot = createPlotlyComponent(Plotly);

function App() {

  const [rows, setRows] = React.useState([])
  React.useEffect(() => {
    async function getData() {
      const response = await fetch(data)
      const reader = response.body.getReader()
      const result = await reader.read() // raw array  
      const decoder = new TextDecoder('utf-8')
      const csv = decoder.decode(result.value) // the csv text
      const rows = Papa.parse(csv, { header: false }) // object with { data, errors, meta }      
      setRows(rows.data)
    }
    getData()
  }, []) // [] means just do this once, after initial render
  
  let [ xAxisDuration, yAxisDuration ] = getXYDurationfromRows(rows);
  let [ xAxisBetween, yAxisBetween ] = getXYBetweenfromRows(rows);

  const estimateMeanValue = 5; //Play with this to scale the round size to your liking
  const meanDuration = yAxisDuration.reduce((a, b) => (a + b), 0) / yAxisDuration.length;
  const maxDuration = Math.max(...yAxisDuration);  
  const minDuration = Math.min(...yAxisDuration);    
  const yAxisScale = yAxisDuration.map(y => (y-(meanDuration - estimateMeanValue))/(maxDuration-minDuration)*100);

  const layoutDuration = {
    title: 'Device time running in time',
    yaxis: {
      title: {
        text: 'time in second'
      }
    }
  }

  const layoutBetween = {
    title: 'Time between each device start in time',
    yaxis: {
      title: {
        text: 'time in minute'
      }
    }
  }

  const dataCombine = [
    {
      x: xAxisBetween,
      y: yAxisBetween,
      type: 'scatter',
      mode: 'markers',
      marker: {
        color: yAxisScale,
        size: yAxisScale
      }
    }
  ]

  const layoutCombine = {
    title: 'Time between each device start and time running in time',
    yaxis: {
      title: {
        text: 'time in minute'
      }
    }
  }

  return (   

    <div className="App">      
      <Plot
        data={[
          {
            x: xAxisDuration,
            y: yAxisDuration,            
            type: 'scatter',
            mode: 'markers',
            marker: {color: 'blue'}, 
          }
        ]}
        layout={layoutDuration}
      />
      <Plot
        data={[
          {
            x: xAxisBetween,
            y: yAxisBetween,
            type: 'scatter',
            mode: 'markers',
            marker: {color: 'blue'}, 
          }
        ]}
        layout={layoutBetween}
      />
      <Plot
        data={dataCombine}
        layout={layoutCombine}
      />
    </div>
  );
}

function getXYDurationfromRows(rows) {
  rows.splice(0, 1);
  let xAxis = [];
  let yAxis = [];
  rows.forEach((row) => {
    let y = parseFloat(String(row[2]).trim());
    if(!isNaN(y))
    {
      xAxis.push(row[0].trim());
      yAxis.push(y);
    }
  });
  
  return [ xAxis, yAxis ];
}

function getXYBetweenfromRows(rows) {
  rows.splice(0, 1);
  let xAxis = [];
  let yAxis = [];
  rows.forEach((row, index) => {    
    if(index > 0)    
    {
      let currentDate = String(row[0]);
      currentDate.replace(" ", "T");
      let previousDate =  String(rows[index-1][0]);
      previousDate.replace(" ", "T");      
      let startDate = Date.parse(currentDate);      
      let previousStartDate = Date.parse(previousDate);
      var diff = (startDate - previousStartDate);
      var totalSeconds = parseInt(Math.floor(diff / 1000), 10);
      var totalMinutes = parseInt(Math.floor(totalSeconds / 60), 10);
      if(!isNaN(totalMinutes)){
        xAxis.push(row[0].trim());
        yAxis.push(totalMinutes);
      }      
    }    
  });
  return [ xAxis, yAxis ];
}



export default App;

