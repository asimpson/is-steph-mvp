import React, { Fragment } from 'react';
import ReactDOM from 'react-dom';
const axios = require('axios');

import App from './App';

const request = url =>
  new Promise((resolve, reject) =>
    axios.get(url).then(res => resolve(res.data))
  );

Promise.all([
  request('https://s3.amazonaws.com/mvp-demo/data/ghost.json'),
  request('https://s3.amazonaws.com/mvp-demo/data/steph.json'),
]).then(x => {
  ReactDOM.render(
    <App current={x[1]} ghost={x[0]} />,
    document.querySelector('.app')
  );
});
