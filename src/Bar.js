import React, { Fragment } from 'react';

const determineWidth = (props, target) => {
  if (props.type === 'TS') {
    return `${props[target]['TS'] * 100}%`;
  } else if (props.type === 'PER') {
    return `${props[target]['PER'] * 3}%`;
  } else if (props.type === 'WS') {
    return `${props[target]['WS'] * 4}%`;
  }
};

const returnUnit = props => {
  if (props.type === 'TS') {
    return '100%';
  } else if (props.type === 'PER') {
    return 32;
  } else if (props.type === 'WS') {
    return 25;
  }
};

const Bar = props => {
  const ghost = props.type === 'TS'
    ? props.ghost[props.type] * 100
    : props.ghost[props.type];
  const current = props.type === 'TS'
    ? props.current[props.type] * 100
    : props.current[props.type];
  const max = ghost > current ? Math.round(ghost) : Math.round(current);
  return (
    <svg height="120" width="100%" version="1.1">
      <rect
        fill="#0068B8"
        x="0"
        y="10"
        width={determineWidth(props, 'ghost')}
        height="32"
        rx="16"
      />
      <text x="10" y="32" fill="#FAAA00">
        {parseFloat(ghost).toFixed(2)}
      </text>
      <rect
        fill="#FFFFFF"
        x="0"
        y="50"
        width={determineWidth(props, 'current')}
        height="32"
        rx="16"
      />
      <text x="10" y="72" fill="#FAAA00">
        {parseFloat(current).toFixed(2)}
      </text>
      <line strokeWidth="2" stroke="white" x1="2" x2="100%" y1="82%" y2="82%" />
      <text x="90%" y="100%" fill="white">
        {returnUnit(props)}
      </text>
    </svg>
  );
};

export default Bar;
