import React, { Fragment } from 'react';
import colorMap from './colorMap';

const Select = props => {
  const imageSelect = {
    border: props.selected
      ? `5px solid ${colorMap[props.selected].line}`
      : 'none',
    backgroundImage: props.selected
      ? `url('./assets/${props.selected}.png'), url(/assets/${props.selected}-chevron.svg)`
      : 'none',
    backgroundSize: '60px auto, auto',
    backgroundRepeat: 'no-repeat',
    backgroundPosition: '5px center, 93% center',
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
    paddingRight: '3rem',
    boxShadow: '8px 8px 16px 0 rgba(0,0,0,0.06)',
    color: 'black',
  };

  const chevron = {
    backgroundImage: `url(/assets/${props.player}-chevron.svg)`,
    backgroundSize: 'auto',
    backgroundRepeat: 'no-repeat',
    backgroundPosition: '93% center',
  };

  const styles = props.selected
    ? Object.assign(style, imageSelect)
    : Object.assign(style, chevron);

  return (
    <select className={props.className} style={styles} onChange={props.changed}>
      {props.children}
    </select>
  );
};

export default Select;
