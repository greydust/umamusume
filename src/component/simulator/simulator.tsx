import { Button } from 'antd';
import React, { Component } from 'react';

import CourseData from './course-data';
import HorseData from './horse-data';
import RaceResult from './race-result';

import '../../app.css';

interface IProps {
  localization: { [key: string]: string };
}

interface IState {
  raceResult: any
}

class Calculator extends Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);
    this.state = {
      raceResult: {},
    };
  }

  calculate = () => {

  };

  render() {
    const { localization } = this.props;
    const { raceResult } = this.state;
    return (
      <div className="content">
        <HorseData localization={localization} />
        <CourseData localization={localization} />
        <Button type="primary" onClick={this.calculate}>{localization.simulatorCalculate}</Button>
        <RaceResult localization={localization} result={raceResult} />
      </div>
    );
  }
}

export default Calculator;
