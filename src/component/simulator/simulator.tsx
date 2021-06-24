import _ from 'lodash';
import React, { Component } from 'react';

import {
  CourseCategory, CourseDataType, GroundStatus, GroundType, LocalizationData, ProperRate, RunningStyle,
} from '../../common';
import {
  IHorseState, IGroundProperRate, IDistanceProperRate, IRunningStyleProperRate,
} from './common';
import CourseData from './course-data';
import HorseData from './horse-data';
import RaceResult from './race-result';
import SimulatorCalculator from './simulator-calculator';

import 'antd/dist/antd.css';
import './simulator.css';
import '../../app.css';

import courseJson from '../../db/course.json';

const courses = courseJson as { [key: string]: CourseDataType };

interface IProps {
  localization: LocalizationData;
}

interface IState extends IHorseState, IGroundProperRate, IDistanceProperRate, IRunningStyleProperRate {
  strategy?: RunningStyle,
  racecourse?: string,
  ground?: GroundType,
  distance?: string,
  course?: CourseDataType,
  groundStatus?: GroundStatus,

  raceResult?: any,
}

class Simulator extends Component<IProps, IState> {
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
    };

    this.loadCourseData();
  }

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
    const { raceResult } = this.state;
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
        <SimulatorCalculator
          localization={localization}
          state={this.state}
          setData={this.setData}
        />
        <RaceResult localization={localization} result={raceResult} />
      </div>
    );
  }
}

export default Simulator;
