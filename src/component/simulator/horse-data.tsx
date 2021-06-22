import React, { Component } from 'react';

import { LocalizationData } from '../../common';
import HorseProperRate from './horse-proper-rate';
import HorseStatData from './horse-stat-data';

interface IProps {
  localization: LocalizationData;
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
