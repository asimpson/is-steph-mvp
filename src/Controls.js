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
      <div className="challengers">
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            padding: '0.2rem',
            borderRadius: '100em',
            border: '5px solid white',
            maxWidth: '200px',
            marginRight: '1rem',
            color: 'white',
          }}
        >
          <img
            style={{ border: `6px solid ${colorMap.ghost}` }}
            className="player"
            src="./assets/steph.png"
          />
          <div style={{ marginRight: '1rem' }}>
            <p style={{ margin: '0' }}>Steph Curry</p>
            <p style={{ margin: '0' }}>2015-2016</p>
          </div>
        </div>
        <Select selected={props.selected} changed={props.challenge}>
          <option value="steph">Steph Curry</option>
          <option value="harden">James Harden</option>
          <option value="davis">Anthony Davis</option>
        </Select>
      </div>
    </div>
  );
};

export default Controls;
