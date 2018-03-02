import React, { Fragment, Component } from 'react';

class Graph extends Component {
  constructor(props) {
    super(props);

    this.state = {
      styles: {
        opacity: '0',
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

    const data = this.props.data
      .map(x => x[this.props.type])
      .filter(x => x !== 'NA')
      .map(
        (x, i) =>
          i === 0
            ? `10,${this.props.max - x * VERTSCALE}`
            : `${40 * i + 10},${this.props.max - x * VERTSCALE}`
      );

    const circles = data.map((x, i) =>
      <circle
        key={i}
        style={this.state.styles}
        fill={this.props.ghost ? '#014C86' : '#FFE09A'}
        cx={x.split(',')[0]}
        cy={x.split(',')[1]}
        r="4"
      />
    );

    return (
      <Fragment>
        <path
          stroke={this.props.ghost ? '#0068B8' : '#FFFFFF'}
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
