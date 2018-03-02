import React, { Fragment, Component } from 'react';
import classnames from 'classnames';

import colorMap from './colorMap';

class Graph extends Component {
  constructor(props) {
    super(props);

    this.state = {
      styles: {
        opacity: '0',
        show: '',
      },
    };
    this.fadeIn = this.fadeIn.bind(this);
  }

  componentDidMount() {
    const length = this.path.getTotalLength();
    this.path.style.strokeDasharray = `${length} ${length}`;
    this.path.style.strokeDashoffset = length;
    this.path.style.transition = 'stroke-dashoffset 3s ease-in-out';
    window.setTimeout(this.fadeIn, 300);
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.animationDone !== nextProps.animationDone) {
      this.path.style.strokeDasharray = 'none';
    }
  }

  fadeIn() {
    this.setState((prevState, props) => {
      this.path.style.strokeDashoffset = '0';
      return {
        styles: {
          opacity: '1',
          transition: 'opacity 4s ease-in',
        },
      };
    });
  }

  render() {
    const VERTSCALE = 5;
    // y axis is "px from the top". so it works backwards.
    // we need to do heigth - points to get our point.

    const opponents = this.props.data
      .filter(x => x['points'] !== 'NA')
      .map(x => x['opp']);

    const stat = this.props.data
      .map(x => x[this.props.type])
      .filter(x => x !== 'NA');

    const data = this.props.data
      .map(x => x[this.props.type])
      .filter(x => x !== 'NA')
      .map(
        (x, i) =>
          i === 0
            ? `10,${this.props.max - x * VERTSCALE}`
            : `${40 * i + 10},${this.props.max - x * VERTSCALE}`
      );

    const opp = (i, x, y) => {
      const tooltipClass = classnames('tooltip', {
        'tooltip-show': this.state.show === i,
      });
      const key = `opp-${i}`;
      if (!this.props.ghost) {
        return (
          <foreignObject key={key} x={x} y={y} width="80" height="100">
            <div className={tooltipClass} xmlns="http://www.w3.org/1999/xhtml">
              <p>{stat[i]}</p>
              <p>{opponents[i]}</p>
            </div>
          </foreignObject>
        );
      }
      return null;
    };

    const circles = data.map((x, i) =>
      <Fragment key={i}>
        <circle
          style={this.state.styles}
          onClick={() => this.setState({ show: i })}
          onMouseOver={() => this.setState({ show: i })}
          fill={this.props.ghost ? '#014C86' : '#FFE09A'}
          cx={x.split(',')[0]}
          cy={x.split(',')[1]}
          r="4"
        />
        {opp(i, x.split(',')[0], x.split(',')[1])}
      </Fragment>
    );

    return (
      <Fragment>
        <path
          stroke={colorMap[this.props.selected]}
          fill="none"
          ref={ref => (this.path = ref)}
          strokeWidth="10"
          strokeLinecap="round"
          strokeLinejoin="round"
          d={`M${data.join(' ')}`}
        />
        {circles}
      </Fragment>
    );
  }
}

export default Graph;
