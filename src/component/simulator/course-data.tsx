import React, { Component } from 'react';

import { LocalizationData } from '../../common';

interface IProps {
  localization: LocalizationData;
}

interface IState {
}

class CourseData extends Component<IProps, IState> {
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

export default CourseData;
