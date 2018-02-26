import React, { Fragment } from 'react';
import ReactDOM from 'react-dom';

import Graph from './Graph';
import Bar from './Bar';
import ghost from './ghost';
import current from './current';
import { ghostAvg, currentAvg } from './avg';

const App = () => {
  const width = 82 * 40;
  const viewBox = `0 0 ${width} 100`;
  return (
    <Fragment>
      <svg viewBox={viewBox} version="1.1">
        <Graph data={ghost} ghost={true} />
        <Graph data={current} ghost={false} />
      </svg>

      <svg viewBox="0 0 500 100" version="1.1">
        <Bar ghost={ghostAvg} current={currentAvg} type="TS" />
      </svg>

      <svg viewBox="0 0 500 100" version="1.1">
        <Bar ghost={ghostAvg} current={currentAvg} type="PER" />
      </svg>

      <svg viewBox="0 0 500 100" version="1.1">
        <Bar ghost={ghostAvg} current={currentAvg} type="WS" />
      </svg>
    </Fragment>
  );
};

ReactDOM.render(<App />, document.querySelector('.app'));
