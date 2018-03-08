import React, { Fragment } from 'react';
import colorMap from './colorMap';

const Select = props => {
  const imageSelect = {
    border: props.selected
      ? `5px solid ${colorMap[props.selected].line}`
      : 'none',
    backgroundImage: props.selected
      ? `url('./assets/${props.selected}.png')`
      : 'none',
    backgroundSize: '60px auto',
    backgroundRepeat: 'no-repeat',
    backgroundPosition: '5px center',
    paddingLeft: '70px',
  };
  const style = {
    WebkitAppearance: 'none',
    MozAppearance: 'none',
    backgroundColor: 'white',
    border: 'none',
    borderRadius: '35px',
    fontSize: '16px',
    fontWeight: 'bold',
    padding: '1rem',
    appearance: 'none',
    boxShadow: '8px 8px 16px 0 rgba(0,0,0,0.06)',
  };

  const styles = props.selected ? Object.assign(style, imageSelect) : style;

  return (
    <select style={styles} onChange={props.changed} name="graph">
      {props.children}
    </select>
  );
};

export default Select;
