import React, { Fragment } from 'react';

const Bar = props => {
  const ghost = props.type === 'TS'
    ? props.ghost[props.type] * 100
    : props.ghost[props.type];
  const current = props.type === 'TS'
    ? props.current[props.type] * 100
    : props.current[props.type];
  const max = ghost > current ? Math.round(ghost) : Math.round(current);
  return (
    <Fragment>
      <text x="100" y="50">{props.type} {max}</text>
      <rect fill="#0068B8" x="0" y="10" width={ghost} height="32" rx="16" />
      <rect fill="#FFFFFF" x="0" y="50" width={current} height="32" rx="16" />
    </Fragment>
  );
};

export default Bar;
