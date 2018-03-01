import React from 'react';

import Select from './Select';

const Controls = props => {
  return (
    <div style={{ margin: '1rem auto', maxWidth: '1200px' }}>
      <Select changed={props.selection} />
    </div>
  );
};

export default Controls;
