import React from 'react';

import Select from './Select';

const Controls = props => {
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        margin: '1rem auto',
        maxWidth: '1200px',
      }}
    >
      <Select changed={props.selection}>
        <option value="points">Points per game average</option>
        <option value="assists">Assists per game average</option>
        <option value="rebounds">Rebounds per game average</option>
      </Select>
      <Select changed={props.challenge}>
        <option value="steph">Steph Curry</option>
        <option value="harden">James Harden</option>
        <option value="davis">Anthony Davis</option>
      </Select>
    </div>
  );
};

export default Controls;
