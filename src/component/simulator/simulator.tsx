import { Button } from 'antd';
import React, { Component } from 'react';

import { CourseCategory, CourseDataType, LocalizationData } from '../../common';

import CourseData from './course-data';
import HorseData from './horse-data';
import RaceResult from './race-result';

import 'antd/dist/antd.css';
import '../../app.css';

import courseJson from '../../db/course.json';

const courses = courseJson as { [key: string]: CourseDataType };

interface IProps {
  localization: LocalizationData;
}

interface IState {
  raceResult: any
}

class Calculator extends Component<IProps, IState> {
  private courseCategories: CourseCategory = {};

  constructor(props: IProps) {
    super(props);
    this.state = {
      raceResult: {},
    };

    this.loadCourseData();
  }

  calculate = () => {

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
        <HorseData localization={localization} />
        <CourseData localization={localization} courseCategories={this.courseCategories} />
        <Button type="primary" onClick={this.calculate}>{localization.site.SimulatorCalculate}</Button>
        <RaceResult localization={localization} result={raceResult} />
      </div>
    );
  }
}

export default Calculator;
