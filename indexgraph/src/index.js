import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';

const TEST_NUM_SCENARIO = 3;
const TEST_NUM_INDEX = 4;
const TEST_NUM_TIME_STEP = 11;
const createRandomSeries = () => Array.from(Array(TEST_NUM_TIME_STEP)).map(x => Math.random());

let seriesData = {
    timeRange: [2008, 2009, 2010, 2011, 2012, 2013, 2014, 2015, 2016, 2017, 2018],
    scenarioNames: Array.from(Array(TEST_NUM_SCENARIO)).map((d, i) => `Scenario ${i}`),
    susIndexNames: Array.from(Array(TEST_NUM_INDEX)).map((d, i) => `Index ${i}`),
};

// Generate dummy test data

let chartBlocks = [];

for (let iIndex = 0; iIndex < TEST_NUM_INDEX; iIndex++) {
    for (let iScenario = 0; iScenario < TEST_NUM_SCENARIO; iScenario++) {
        chartBlocks.push({
            scenarioIdx: iScenario,
            scenarioName: `Scenario ${iScenario}`,
            susIndexIdx: iIndex,
            susIndexName: `Index ${iIndex}`,
            series: createRandomSeries()
        })
    }
}

seriesData.chartBlocks = chartBlocks;

ReactDOM.render(<App data={seriesData}/>, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
