import React, { Fragment } from 'react';

const Select = props => {
  return (
    <select onChange={props.changed} name="graph">
      <option value="points">Points per game average</option>
      <option value="assists">Assists per game average</option>
      <option value="rebounds">Rebounds per game average</option>
    </select>
  );
};

export default Select;
