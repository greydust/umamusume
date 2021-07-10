import React, { Component } from 'react';

import _ from 'lodash';
import Common, { CourseDataType, LocalizationData } from '../../library/common';
import { RaceResultData } from './common';
import constant from '../../library/race/constant';
import { ResultFlag } from '../../library/race/common';

import './simulator.css';


import i18next from 'i18next';


interface IProps {
  // localization: LocalizationData;
  raceResults: RaceResultData[];
  course?: CourseDataType,
}

interface IState {
}

class RaceResult extends Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);
  }

  render() {
    const { raceResults, course } = this.props;
    if (course === undefined || raceResults.length === 0) {
      return (
        <>
        </>
      );
    }

    const timeAverage = _.meanBy(raceResults, 'time');
    const timeShown: string = (timeAverage * constant.course.finishTimeCoef > parseFloat(course.finish_time_min) / 10000)
      ? Common.secondToTime(timeAverage * constant.course.finishTimeCoef)
      : i18next.t('TimeMin');

    let timeDeviationSum = 0;
    let fullLastSpurtCount = 0;
    let hpLeftSum = 0;
    for (const result of raceResults) {
      timeDeviationSum += (result.time - timeAverage) ** 2;
      if (result.resultFlags.has(ResultFlag.FullLastSpurt)) {
        fullLastSpurtCount += 1;
      }
      hpLeftSum += result.hpLeft;
    }
    return (
      <table>
        <tr>
          <th>{i18next.t('TimeAverage')}</th>
          <th>{i18next.t('TimeStandardDeviation')}</th>
          <th>{i18next.t('TimeShown')}</th>
          <th>{i18next.t('FullLastSpurtRate')}</th>
          <th>{i18next.t('HpLeftAverage')}</th>
        </tr>
        <tr>
          <td>{timeAverage.toFixed(3)}</td>
          <td>{Math.sqrt(timeDeviationSum / raceResults.length).toFixed(3)}</td>
          <td>{timeShown}</td>
          <td>{(fullLastSpurtCount / raceResults.length).toLocaleString('en', { style: 'percent' })}</td>
          <td>{(hpLeftSum / raceResults.length).toFixed(3)}</td>
        </tr>
      </table>
    );
  }
}

export default RaceResult;
