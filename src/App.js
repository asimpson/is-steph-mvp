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
    const types = {
      pts: 'points',
      ast: 'assists',
      rbd: 'rebounds',
    };
    const width = 82 * 40;
    const max =
      Math.max(
        ...ghost
          .concat(current)
          .map(x => x[types[this.state.graphType]])
          .filter(x => x !== 'NA')
      ) + 10;

    const type = {
      ast: 'Assists',
      pts: 'Points',
      rbd: 'Rebounds',
    };

    const VERTSCALE = 5;
    const maxScaled = max * VERTSCALE;
    const segmentScale = 10 * VERTSCALE;
    const segments = [
      ...Array(Math.ceil(maxScaled / segmentScale)).keys(),
    ].map(x =>
      <line
        key={x}
        strokeWidth="1"
        stroke="white"
        x1="2"
        x2={width}
        y1={x === 0 ? maxScaled : maxScaled - x * segmentScale}
        y2={x === 0 ? maxScaled : maxScaled - x * segmentScale}
      />
    );
    return (
      // transition: ease-in-out .5s;
      // transform: translate(-200px, 0);
      <Fragment>
        <div style={{ overflowX: 'hidden' }}>
          <Select changed={this.selection} />
          <p>{type[this.state.graphType]} Per Game Avg</p>
          <svg
            // style={{ overflowX: 'scroll' }}
            height={max * VERTSCALE + 10}
            width={width}
            version="1.1"
          >
            {segments}
            <line
              strokeWidth="1"
              stroke="white"
              x1="2"
              x2="2"
              y1="0"
              y2={max * VERTSCALE}
            />
            <Graph
              max={max * VERTSCALE}
              type={this.state.graphType}
              data={ghost}
              ghost={true}
            />
            <Graph
              max={max * VERTSCALE}
              type={this.state.graphType}
              data={current}
              ghost={false}
            />
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
