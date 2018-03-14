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
    this.showTooltip = this.showTooltip.bind(this);
  }

  componentDidMount() {
    const length = this.path.getTotalLength();
    this.path.style.strokeDasharray = `${length} ${length}`;
    this.path.style.strokeDashoffset = length;
    window.setTimeout(this.fadeIn, 300);
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.animationDone !== nextProps.animationDone) {
      this.path.style.strokeDasharray = 'none';
    }
  }

  showTooltip(i) {
    this.setState({ show: i });
  }

  fadeIn() {
    this.setState((prevState, props) => {
      this.path.style.transition = 'stroke-dashoffset 3s ease-in-out';
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
            ? `10,${this.props.max - x * this.props.VERTSCALE}`
            : `${40 * i + 10},${this.props.max - x * this.props.VERTSCALE}`
      );

    const opp = (i, x, y) => {
      const tooltipClass = classnames('tooltip', {
        'tooltip-show': this.state.show === i,
      });
      const key = `opp-${i}`;
      if (!this.props.ghost) {
        return (
          <foreignObject key={key} x={x} y={y} width="130" height="100">
            <div className={tooltipClass} xmlns="http://www.w3.org/1999/xhtml">
              <p>{stat[i]}</p>
              <p>vs {opponents[i]}</p>
            </div>
          </foreignObject>
        );
      }
      return null;
    };

    const tooltips = data.map((x, i) => {
      return (
        <Fragment key={i}>
          {opp(i, x.split(',')[0], x.split(',')[1])}
        </Fragment>
      );
    });

    const circles = data.map((x, i) =>
      <circle
        style={this.state.styles}
        key={i}
        stroke="red"
        strokeOpacity="0"
        strokeWidth="30"
        onClick={this.props.ghost ? null : this.showTooltip.bind(this, i)}
        onMouseEnter={this.props.ghost ? null : this.showTooltip.bind(this, i)}
        fill={colorMap[this.props.selected].circle}
        cx={x.split(',')[0]}
        cy={x.split(',')[1]}
        r="4"
      />
    );

    const avg = () => {
      const typeMap = {
        points: 'PTS',
        assists: 'AST',
        rebounds: 'TRB',
      };
      if (!this.props.ghost) {
        const [x, y] = data[data.length - 1].split(',');
        const tooltipClass = classnames('tooltip', {
          'tooltip-show': this.props.animationDone,
        });
        return (
          <foreignObject x={x} y={y - 100} width="130" height="100">
            <div className={tooltipClass} xmlns="http://www.w3.org/1999/xhtml">
              <p>{this.props.avg[this.props.type]}</p>
              <p>{typeMap[this.props.type]}</p>
            </div>
          </foreignObject>
        );
      }

      return null;
    };

    return (
      <Fragment>
        <path
          stroke={colorMap[this.props.selected].line}
          fill="none"
          ref={ref => (this.path = ref)}
          strokeWidth="10"
          strokeLinecap="round"
          strokeLinejoin="round"
          d={`M${data.join(' ')}`}
        />
        {circles}
        {tooltips}
        {avg()}
      </Fragment>
    );
  }
}

export default Graph;
