import React, { Component } from 'react';

interface IProps {
  localization: { [key: string]: string };
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
