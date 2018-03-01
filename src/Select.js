import React, { Fragment } from 'react';

const Select = props => {
  const style = {
    WebkitAppearance: 'none',
    MozAppearance: 'none',
    background: 'white',
    border: 'none',
    borderRadius: '35px',
    fontSize: '16px',
    fontWeight: 'bold',
    padding: '1rem',
    appearance: 'none',
    boxShadow: '8px 8px 16px 0 rgba(0,0,0,0.06)',
  };

  return (
    <select style={style} onChange={props.changed} name="graph">
      {props.children}
    </select>
  );
};

export default Select;
