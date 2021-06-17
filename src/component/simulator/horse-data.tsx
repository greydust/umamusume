import React, { Component } from 'react';

import HorseProperRate from './horse-proper-rate';
import HorseStatData from './horse-stat-data';

interface IProps {
  localization: { [key: string]: string };
}

interface IState {
}

class HorseData extends Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);
  }

  render() {
    const { localization } = this.props;
    return (
      <div>
        <HorseStatData localization={localization} />
        <HorseProperRate localization={localization} />
      </div>
    );
  }
}

export default HorseData;
