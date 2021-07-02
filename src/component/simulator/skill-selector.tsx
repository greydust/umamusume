import React, { Component } from 'react';

import { LocalizationData } from '../../library/common';

interface IProps {
  localization: LocalizationData,
  setData: (key: string, value: any) => void,
  state: {
  },
}

interface IState {
}

class SkillSelector extends Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);
    this.state = {
    };
  }

  render() {
    return (
      <>
      </>
    );
  }
}

export default SkillSelector;
