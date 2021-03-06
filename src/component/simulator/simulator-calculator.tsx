import _ from 'lodash';
import {
  Button, Col, InputNumber, Row, Progress,
} from 'antd';
import React, { Component } from 'react';
import Promise from 'bluebird';

import {
  CourseDataType, DistanceType, GroundStatus, GroundType, LocalizationData, RunningStyle, SkillData,
} from '../../library/common';
import { RaceResultData, Season, Weather } from '../../library/race/common';
import {
  IHorseState, IGroundProperRate, IDistanceProperRate, IRunningStyleProperRate,
} from './common';
import Horse from '../../library/race/horse';
import Course from '../../library/race/course';
import RaceHorse from '../../library/race/race-horse';

import skillJson from '../../db/skill.json';

import 'antd/dist/antd.css';
import '../component.css';

const skillData = skillJson as { [key: string]: SkillData };

interface SimulatorState extends IHorseState, IGroundProperRate, IDistanceProperRate, IRunningStyleProperRate {
  strategy?: string,
  groundStatus?: string,

  racecourse?: string,
  ground?: string,
  distance?: number,
  course?: CourseDataType,

  skills?: string[],
}

interface IProps {
  localization: LocalizationData;
  setData: (key: string, value: any) => void,
  state: SimulatorState,
}

interface IState {
  running: boolean,
  finished: number,
  rounds: number,
}

class SimulatorCalculator extends Component<IProps, IState> {
  static readonly concurrency = 50;

  constructor(props: IProps) {
    super(props);
    this.state = {
      running: false,
      rounds: 1000,
      finished: 0,
    };
  }

  calculate = async () => {
    this.setState({
      running: true,
      finished: 0,
    });
    const { state, setData } = this.props;
    const {
      speed, stamina, pow, guts, wiz,
      strategy, groundStatus, course,
      skills,
      groundTypeTurf, groundTypeDirt,
      distanceTypeShort, distanceTypeMile, distanceTypeMiddle, distanceTypeLong,
      runningStyleNige, runningStyleSenko, runningStyleSashi, runningStyleOikomi,
    } = state;
    const { rounds } = this.state;

    const targetCourse = new Course({
      courseData: course as CourseDataType,
      groundStatus: groundStatus as GroundStatus,
    });
    const targetHorse = new Horse({
      stat: {
        speed, stamina, pow, guts, wiz,
      },
      properRate: {
        groundType: {
          [GroundType.Turf]: groundTypeTurf,
          [GroundType.Dirt]: groundTypeDirt,
        },
        distanceType: {
          [DistanceType.Short]: distanceTypeShort,
          [DistanceType.Mile]: distanceTypeMile,
          [DistanceType.Middle]: distanceTypeMiddle,
          [DistanceType.Long]: distanceTypeLong,
        },
        runningStyle: {
          [RunningStyle.Nige]: runningStyleNige,
          [RunningStyle.Senko]: runningStyleSenko,
          [RunningStyle.Sashi]: runningStyleSashi,
          [RunningStyle.Oikomi]: runningStyleOikomi,
        },
      },
      skills: _.map(skills, (skillId) => (skillData[skillId])),
    });

    let counter = 0;
    let started = 0;
    const worksPerThread = Math.ceil(rounds / SimulatorCalculator.concurrency);
    const raceResults: RaceResultData[] = [];
    await Promise.map(
      new Array(SimulatorCalculator.concurrency),
      async () => {
        const raceHorse = new RaceHorse({
          horse: targetHorse,
          course: targetCourse,
          runningStyle: strategy as RunningStyle,
          season: Season.Spring,
          weather: Weather.Sunny,
          postNumber: 1,
          popularity: 1,
          sameRunningStyle: 0,
          popularityFirstRunningStyle: strategy as RunningStyle,
        });
        for (let i = 0; i < worksPerThread && started < rounds; i += 1) {
          started += 1;
          raceHorse.simulate();
          raceResults.push(raceHorse.raceResult);
          counter += 1;
          this.setState({ finished: counter });
          await Promise.delay(0);
        }
      },
      { concurrency: SimulatorCalculator.concurrency },
    );
    this.setState({ running: false });
    setData('raceResults', raceResults);
  };

  render() {
    const { localization, state } = this.props;
    const { course } = state;
    const { finished, rounds, running } = this.state;
    const progressPercent = _.round(finished / rounds * 100, 1);
    return (
      <Row gutter={[8, 8]}>
        <Col span={4}>
          <div className="flex">
            <span className="select-label">{`${localization.site.SimulatorCalculateRounds}:`}</span>
            <InputNumber
              className="select"
              value={rounds}
              min={1}
              max={1000}
              onChange={(value) => this.setState({ rounds: value })}
            />
            <Button
              className="select-label"
              type="primary"
              disabled={course === undefined || running}
              onClick={this.calculate}
            >
              {localization.site.SimulatorCalculate}
            </Button>
            { running ? <Progress className="select-label" percent={progressPercent} /> : null }
          </div>
        </Col>
      </Row>
    );
  }
}

export default SimulatorCalculator;
