import React, { Fragment } from 'react';

const Select = props => {
  return (
    <select onChange={props.changed} name="graph">
      <option value="pts">Points per game average</option>
      <option value="ast">Assists per game average</option>
      <option value="rbd">Rebounds per game average</option>
    </select>
  );
};

export default Select;
