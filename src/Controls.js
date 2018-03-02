import React from 'react';

import Select from './Select';
import colorMap from './colorMap';

const Controls = props => {
  return (
    <div className="player-select--wrapper">
      <div className="player-select">
        <Select changed={props.selection}>
          <option value="points">Points per game average</option>
          <option value="assists">Assists per game average</option>
          <option value="rebounds">Rebounds per game average</option>
        </Select>
      </div>
      <div style={{ display: 'flex' }}>
        <img
          style={{ border: `6px solid ${colorMap.ghost}` }}
          className="player"
          src="./assets/steph.png"
        />
        <img
          style={{ border: `6px solid ${colorMap[props.selected]}` }}
          className="player"
          src={`./assets/${props.selected}.png`}
        />
        <Select changed={props.challenge}>
          <option value="steph">Steph Curry</option>
          <option value="harden">James Harden</option>
          <option value="davis">Anthony Davis</option>
        </Select>
      </div>
    </div>
  );
};

export default Controls;
