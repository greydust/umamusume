import React, { Component } from 'react';

import { LocalizationData } from '../../library/common';
import HorseProperRate from './horse-proper-rate';
import HorseStatData from './horse-stat-data';

interface IProps {
  // localization: LocalizationData,
  setData: (key: string, value: any) => void,
  state: any,
}

interface IState {
}

class HorseData extends Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);
  }

  render() {
    const { setData, state } = this.props;
    return (
      <>
        <HorseStatData setData={setData} state={state} />
        <HorseProperRate setData={setData} state={state} />
      </>
    );
  }
}

export default HorseData;
