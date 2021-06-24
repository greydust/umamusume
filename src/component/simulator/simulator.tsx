import _ from 'lodash';
import {
  Button, Col, InputNumber, Row, Progress,
} from 'antd';
import React, { Component } from 'react';
import Promise from 'bluebird';

import {
  CourseCategory, CourseDataType, DistanceType, GroundStatus, GroundType, LocalizationData, ProperRate, RunningStyle,
} from '../../common';
import CourseData from './course-data';
import HorseData from './horse-data';
import RaceResult from './race-result';
import Horse from '../../library/race/horse';
import Course from '../../library/race/course';
import RaceHorse from '../../library/race/race-horse';

import 'antd/dist/antd.css';
import './simulator.css';
import '../../app.css';

import courseJson from '../../db/course.json';

const courses = courseJson as { [key: string]: CourseDataType };

interface IProps {
  localization: LocalizationData;
}

interface IHorseState {
  speed: number,
  stamina: number,
  pow: number,
  guts: number,
  wiz: number,
}

interface IGroundProperRate {
  groundTypeTurf: ProperRate,
  groundTypeDirt: ProperRate,
}

interface IDistanceProperRate {
  distanceTypeShort: ProperRate,
  distanceTypeMile: ProperRate,
  distanceTypeMiddle: ProperRate,
  distanceTypeLong: ProperRate,
}

interface IRunningStyleProperRate {
  runningStyleNige: ProperRate,
  runningStyleSenko: ProperRate,
  runningStyleSashi: ProperRate,
  runningStyleOikomi: ProperRate,
}

interface IState extends IHorseState, IGroundProperRate, IDistanceProperRate, IRunningStyleProperRate {
  strategy?: RunningStyle,
  racecourse?: string,
  ground?: GroundType,
  distance?: string,
  course?: CourseDataType,
  groundStatus?: GroundStatus,

  running: boolean,
  finished: number,
  rounds: number,
  raceResult?: any,
}

class Calculator extends Component<IProps, IState> {
  private courseCategories: CourseCategory = {};

  constructor(props: IProps) {
    super(props);
    this.state = {
      speed: 1,
      stamina: 1,
      pow: 1,
      guts: 1,
      wiz: 1,

      groundTypeTurf: ProperRate.A,
      groundTypeDirt: ProperRate.A,

      distanceTypeShort: ProperRate.A,
      distanceTypeMile: ProperRate.A,
      distanceTypeMiddle: ProperRate.A,
      distanceTypeLong: ProperRate.A,

      runningStyleNige: ProperRate.A,
      runningStyleSenko: ProperRate.A,
      runningStyleSashi: ProperRate.A,
      runningStyleOikomi: ProperRate.A,

      running: false,
      rounds: 1000,
      finished: 0,
      raceResult: {},
    };

    this.loadCourseData();
  }

  setData = (key: string, value: any): void => {
    switch (key) {
      case 'racecourse':
        this.setState({
          racecourse: value,
          ground: undefined,
          distance: undefined,
          course: undefined,
        });
        break;
      case 'ground':
        this.setState({
          ground: value as GroundType,
          distance: undefined,
          course: undefined,
        });
        break;
      case 'distance':
      case 'strategy':
      case 'groundStatus':
        this.setState<'distance' | 'strategy' | 'groundStatus'>({ [key]: value }, this.updateCourse);
        break;
      case 'speed':
      case 'stamina':
      case 'pow':
      case 'guts':
      case 'wiz':
        this.setState({ [key]: value as number } as Pick<IHorseState, keyof IHorseState>);
        break;
      default:
        this.setState({ [key]: value });
        break;
    }
  };

  calculate = async () => {
    this.setState({
      running: true,
      finished: 0,
    });
    const {
      speed, stamina, pow, guts, wiz,
      strategy, groundStatus, ground, distance, course,
      groundTypeTurf, groundTypeDirt,
      distanceTypeShort, distanceTypeMile, distanceTypeMiddle, distanceTypeLong,
      runningStyleNige, runningStyleSenko, runningStyleSashi, runningStyleOikomi,
      rounds,
    } = this.state;

    const targetCourse = new Course({
      distance: parseInt(distance as string, 10),
      groundStatus: groundStatus as GroundStatus,
      groundType: ground as GroundType,
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
    });

    let counter = 0;
    const raceHorse = new RaceHorse({
      horse: targetHorse, course: targetCourse, runningStyle: strategy as RunningStyle,
    });
    for (let i = 0; i < rounds; i += 1) {
      raceHorse.simulate();
      counter += 1;
      console.log(raceHorse.hp, raceHorse.time, counter);
      this.setState({ finished: i });
      await Promise.delay(0);
    }
    this.setState({ running: false });
  };

  updateCourse = () => {
    const {
      strategy, racecourse, ground, distance, groundStatus,
    } = this.state;
    if (racecourse === undefined || ground === undefined || distance === undefined || strategy === undefined || groundStatus === undefined) {
      this.setState({ course: undefined });
    } else {
      this.setState({ course: this.courseCategories[racecourse][ground][distance] });
    }
  };

  loadCourseData() {
    for (const courseId of Object.keys(courses)) {
      const course = courses[courseId];
      if (!(course.race_track_id in this.courseCategories)) {
        this.courseCategories[course.race_track_id] = {};
      }
      if (!(course.ground in this.courseCategories[course.race_track_id])) {
        this.courseCategories[course.race_track_id][course.ground] = {};
      }
      this.courseCategories[course.race_track_id][course.ground][course.distance] = course;
    }
  }

  render() {
    const { localization } = this.props;
    const {
      raceResult, course, finished, rounds, running,
    } = this.state;
    const progressPercent = _.round(finished / rounds * 100, 1);
    return (
      <div className="content">
        <HorseData
          localization={localization}
          setData={this.setData}
          state={this.state}
        />
        <CourseData
          localization={localization}
          courseCategories={this.courseCategories}
          setData={this.setData}
          state={this.state}
        />
        <Row gutter={[8, 8]}>
          <Col span={4}>
            <div className="flex">
              <span className="select-label">{`${localization.site.SimulatorCalculateRounds}:`}</span>
              <InputNumber
                className="select"
                value={rounds}
                min={1}
                max={1000}
                onChange={(value) => this.setData('rounds', value)}
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
        <RaceResult localization={localization} result={raceResult} />
      </div>
    );
  }
}

export default Calculator;
