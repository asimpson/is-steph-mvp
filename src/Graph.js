import React, { Fragment } from 'react';

const Graph = props => {
  const VERTSCALE = 5;
  // y axis is "px from the top". so it works backwards.
  // we need to do heigth - points to get our point.

  const data = props.data
    .map(x => x[props.type])
    .filter(x => x !== 'NA')
    .map(
      (x, i) =>
        i === 0
          ? `10,${props.max - x * VERTSCALE}`
          : `${40 * i + 10},${props.max - x * VERTSCALE}`
    );

  const circles = data.map((x, i) =>
    <circle
      key={i}
      fill={props.ghost ? '#014C86' : '#FFE09A'}
      cx={x.split(',')[0]}
      cy={x.split(',')[1]}
      r="4"
    />
  );
  return (
    <Fragment>
      <polyline
        stroke={props.ghost ? '#0068B8' : '#FFFFFF'}
        fill="none"
        strokeWidth="10"
        strokeLinecap="round"
        strokeLinejoin="round"
        points={data.join(' ')}
      />
      {circles}
    </Fragment>
  );
};

export default Graph;
