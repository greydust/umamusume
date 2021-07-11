/* eslint-disable react/no-unused-state */
import React, { Component } from 'react';

import {
  CourseCategory, CourseDataType, GroundStatus, GroundType, LocalizationData, ProperRate, RunningStyle,
} from '../../library/common';
import {
  IHorseState, IGroundProperRate, IDistanceProperRate, IRunningStyleProperRate, RaceResultData,
} from './common';
import CourseData from '../course-data';
import HorseData from './horse-data';
import RaceData from './race-data';
import RaceResult from './race-result';
import SimulatorCalculator from './simulator-calculator';
import SkillSelector from './skill-selector';

import 'antd/dist/antd.css';
import '../component.css';
import '../../app.css';

import courseJson from '../../db/course.json';

const courses = courseJson as CourseDataType[];

interface IProps {
  localization: LocalizationData;
}

interface IProperRate extends IGroundProperRate, IDistanceProperRate, IRunningStyleProperRate {
}

interface IState extends IHorseState, IProperRate {
  skills?: string[],

  racecourse?: string,
  ground?: GroundType,
  distance?: number,
  course?: CourseDataType,

  strategy?: RunningStyle,
  groundStatus?: GroundStatus,

  raceResults: RaceResultData[],
}

class Simulator extends Component<IProps, IState> {
  private courseCategories: CourseCategory = {};

  constructor(props: IProps) {
    super(props);

    this.loadCourseData();
    this.state = {
      speed: 1200,
      stamina: 300,
      pow: 1200,
      guts: 300,
      wiz: 300,

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

      strategy: RunningStyle.Nige,
      racecourse: '10001',
      ground: GroundType.Turf,
      distance: 1200,
      groundStatus: GroundStatus.Good,
      course: this.courseCategories['10001'][GroundType.Turf][1200],
      raceResults: [],
    };
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
      case 'raceResults':
        this.setState({ raceResults: value });
        break;
      case 'skills':
        this.setState({ skills: value as string[] });
        break;
      default:
        this.setState({ [key]: value } as Pick<IProperRate, keyof IProperRate>);
        break;
    }
  };

  loadCourseData() {
    for (const course of courses) {
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
    const { raceResults, course } = this.state;
    return (
      <div className="content">
        <HorseData
          localization={localization}
          setData={this.setData}
          state={this.state}
        />
        <SkillSelector
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
        <RaceData
          localization={localization}
          setData={this.setData}
          state={this.state}
        />
        <SimulatorCalculator
          localization={localization}
          state={this.state}
          setData={this.setData}
        />
        <RaceResult localization={localization} raceResults={raceResults} course={course} />
      </div>
    );
  }
}

export default Simulator;
