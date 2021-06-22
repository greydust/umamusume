import React, { Component } from 'react';

import { LocalizationData } from '../../common';

interface IProps {
  localization: LocalizationData;
  result: any;
}

interface IState {
}

class RaceResult extends Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);
  }

  render() {
    const { localization } = this.props;
    return (
      <div>
      </div>
    );
  }
}

export default RaceResult;
