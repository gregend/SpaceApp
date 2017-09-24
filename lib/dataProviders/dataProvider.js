import React from 'react';
export default class DataProvider {
    constructor() {
            
    }
    getData(state) {
        const dateString = state.dateYear + '-' + state.dateMonth + '-' + state.dateDay;
        return fetch('https://api.nasa.gov/planetary/apod?api_key=VOJbRrExRvLUhD8sr90T4FpF4VcYRRIF1G7AhSEu&date=' + dateString)
          .then(data => data.json())

    }

}