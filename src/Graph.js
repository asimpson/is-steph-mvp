import React, { Fragment } from 'react';

const Graph = props => {
  // y axis is "px from the top". so it works backwards.
  // we need to do heigth - points to get our point.
  const types = {
    ast: props.data.map(x => x.assists),
    pts: props.data.map(x => x.points),
    rbd: props.data.map(x => x.rebounds),
  };
  const data = types[props.type]
    .filter(x => x !== 'NA')
    .map((x, i) => (i === 0 ? `10,${100 - x}` : `${40 * i + 10},${100 - x}`));

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
