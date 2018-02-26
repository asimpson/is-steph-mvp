import React, { Fragment, Component } from 'react';

import Graph from './Graph';
import Bar from './Bar';
import Select from './Select';
import ghost from './ghost';
import current from './current';
import { ghostAvg, currentAvg } from './avg';

export default class App extends Component {
  constructor(props) {
    super(props);
    this.selection = this.selection.bind(this);

    this.state = {
      graphType: 'pts',
    };
  }

  selection(e) {
    this.setState({ graphType: e.target.value });
  }

  render() {
    const width = 82 * 40;
    const viewBox = `0 0 ${width} 200`;
    const type = {
      ast: 'Assists',
      pts: 'Points',
      rbd: 'Rebounds',
    };
    return (
      <Fragment>
        <div>
          <Select changed={this.selection} />
          <p>{type[this.state.graphType]} Per Game Avg</p>
          <svg viewBox={viewBox} version="1.1">
            <Graph type={this.state.graphType} data={ghost} ghost={true} />
            <Graph type={this.state.graphType} data={current} ghost={false} />
          </svg>
        </div>

        <div>
          <p>TS (True shooting percentage)</p>
          <svg
            style={{ maxWidth: '100px' }}
            viewBox="0 0 100 100"
            version="1.1"
          >
            <Bar ghost={ghostAvg} current={currentAvg} type="TS" />
          </svg>
        </div>

        <div>
          <p>PER (Player Efficency Rating)</p>
          <svg style={{ maxWidth: '50px' }} viewBox="0 0 50 100" version="1.1">
            <Bar ghost={ghostAvg} current={currentAvg} type="PER" />
          </svg>
        </div>

        <div>
          <p>WS (Win Shares)</p>
          <svg style={{ maxWidth: '30px' }} viewBox="0 0 30 100" version="1.1">
            <Bar ghost={ghostAvg} current={currentAvg} type="WS" />
          </svg>
        </div>
      </Fragment>
    );
  }
}
