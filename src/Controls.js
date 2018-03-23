import React from 'react';

import Select from './Select';
import colorMap from './colorMap';

const Controls = props => {
  return (
    <div className="player-select--wrapper">
      <div>
        <Select
          player={props.selected}
          className="stat chevron"
          changed={props.selection}
        >
          <option value="points">Points per game</option>
          <option value="assists">Assists per game</option>
          <option value="rebounds">Rebounds per game</option>
        </Select>
      </div>
      <div className="challengers">
        <div
          className="players-select__ghost"
          style={{
            display: 'flex',
            alignItems: 'center',
            border: '5px solid white',
            marginRight: '1rem',
            color: 'white',
          }}
        >
          <div style={{ marginRight: '1rem' }}>
            <p style={{ fontWeight: '700', margin: '0' }}>Steph Curry</p>
            <p style={{ fontSize: '.9rem', margin: '0', marginTop: '.2rem' }}>
              2015-2016
            </p>
          </div>
        </div>
        <Select
          className="chevron players-select"
          selected={props.selected}
          changed={props.challenge}
        >
          <option value="steph">Steph Curry</option>
          <option value="harden">James Harden</option>
          <option value="davis">Anthony Davis</option>
          <option value="freak">Giannis Antetokounmpo</option>
          <option value="dame">Damian Lillard</option>
          <option value="lebron">Lebron James</option>
        </Select>
      </div>
    </div>
  );
};

export default Controls;
