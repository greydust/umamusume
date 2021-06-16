import React, { Component } from 'react';

import '../../app.css';

interface IProps {
  localization: { [key: string]: string };
}

interface IState {
}

class Calculator extends Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);
  }

  render() {
    return (
      <div className="content">Test 2</div>
    );
  }
}

export default Calculator;
