import React, { Fragment, Component } from 'react';
const axios = require('axios');

import Graph from './Graph';
import Bar from './Bar';
import Controls from './Controls';

const request = url =>
  new Promise((resolve, reject) =>
    axios.get(url).then(res => resolve(res.data))
  );

export default class App extends Component {
  constructor(props) {
    super(props);
    this.selection = this.selection.bind(this);
    this.challenge = this.challenge.bind(this);
    this.triggerAnimation = this.triggerAnimation.bind(this);
    this.tearDownAfterAnimation = this.tearDownAfterAnimation.bind(this);

    this.state = {
      graphType: 'points',
      animateStyles: {},
      animationDone: false,
      scrolled: 0,
      ghost: this.props.ghost,
      challenger: this.props.current,
    };
  }

  tearDownAfterAnimation(distance) {
    document.addEventListener('transitionend', e => {
      if (e.target === this.graphSvg && e.propertyName === 'transform') {
        this.setState(() => {
          return {
            animationDone: true,
            animateStyles: {
              transition: 'unset',
              transform: 'unset',
            },
          };
        }, () => (this.scrollable.scrollLeft = distance));
      }
    });
  }

  componentDidMount() {
    const currentDistance =
      this.state.challenger.perGame.map(x => x.points).filter(x => x !== 'NA')
        .length *
        40 -
      document.body.getBoundingClientRect().width / 2;
    window.setTimeout(this.triggerAnimation, 300, currentDistance);
    this.tearDownAfterAnimation(currentDistance);
  }

  selection(e) {
    this.setState({ graphType: e.target.value });
  }

  challenge(e) {
    const data = {
      harden: 'https://s3.amazonaws.com/mvp-demo/data/harden.json',
      steph: 'https://s3.amazonaws.com/mvp-demo/data/steph.json',
      davis: 'https://s3.amazonaws.com/mvp-demo/data/davis.json',
    };
    request(data[e.target.value]).then(x => {
      this.setState(prevState => {
        return {
          challenger: x,
        };
      });
    });
  }

  triggerAnimation(distance) {
    this.scrollable.scrollLeft = 0;
    this.setState({
      animateStyles: {
        transition: 'ease-in-out 4s',
        transform: `translateX(-${distance}px)`,
      },
    });
  }

  render() {
    const width = 82 * 40;
    const max =
      Math.max(
        ...this.state.ghost.perGame
          .concat(this.state.challenger.perGame)
          .map(x => x[this.state.graphType])
          .filter(x => x !== 'NA')
      ) + 10;

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
    const smallSize = {
      fontSize: '16px',
    };

    const textHeaderStyles = {
      color: 'black',
      fontWeight: '700',
      fontSize: '24px',
      lineHeight: '1',
      margin: '0',
      marginBottom: '1.5rem',
    };

    const rectStyles = {
      background: '#FFBA00',
      padding: '1.2rem 1rem',
      margin: '1rem',
      borderRadius: '15px',
    };
    return (
      <Fragment>
        <Controls challenge={this.challenge} selection={this.selection} />
        <div
          ref={ref => (this.scrollable = ref)}
          style={{
            overflowX: 'scroll',
            WebkitOverflowScrolling: 'touch',
          }}
        >
          <svg
            style={this.state.animateStyles}
            height={max * VERTSCALE + 50}
            width={width}
            version="1.1"
            ref={ref => (this.graphSvg = ref)}
          >
            {segments}
            <line
              strokeWidth="1"
              stroke="white"
              x1="2"
              x2="2"
              y1="0"
              y2={maxScaled}
            />
            <Graph
              animationDone={this.state.animationDone}
              max={maxScaled}
              type={this.state.graphType}
              data={this.state.ghost.perGame}
              ghost={true}
            />
            <Graph
              animationDone={this.state.animationDone}
              max={maxScaled}
              type={this.state.graphType}
              data={this.state.challenger.perGame}
              ghost={false}
            />
          </svg>
        </div>

        <div
          className="flex-container"
          style={{
            justifyContent: 'space-between',
            maxWidth: '1200px',
            margin: '1em auto',
          }}
        >
          <div style={rectStyles}>
            <p style={textHeaderStyles}>
              TS <span style={smallSize}>(True shooting percentage)</span>
            </p>
            <Bar
              ghost={this.state.ghost.avgs}
              current={this.state.challenger.avgs}
              type="TS"
            />
          </div>

          <div style={rectStyles}>
            <p style={textHeaderStyles}>
              PER <span style={smallSize}>(Player Efficency Rating)</span>
            </p>
            <Bar
              ghost={this.state.ghost.avgs}
              current={this.state.challenger.avgs}
              type="PER"
            />
          </div>

          <div style={rectStyles}>
            <p style={textHeaderStyles}>
              WS <span style={smallSize}>(Win Shares)</span>
            </p>
            <Bar
              ghost={this.state.ghost.avgs}
              current={this.state.challenger.avgs}
              type="WS"
            />
          </div>
        </div>
      </Fragment>
    );
  }
}
