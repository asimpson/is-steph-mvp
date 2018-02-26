import React from 'react';
import ReactDOM from 'react-dom';

import Graph from './Graph';
import ghost from './ghost';
import current from './current';

const App = () => {
  const width = 82 * 40;
  const viewBox = `0 0 ${width} 100`;
  return (
    <svg viewBox={viewBox} version="1.1">
      <Graph data={ghost} ghost={true} />
      <Graph data={current} ghost={false} />
    </svg>
  );
};

ReactDOM.render(<App />, document.querySelector('.app'));
