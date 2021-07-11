/* eslint-disable react/no-unused-state */
import React, { Component } from 'react';

import {
  CourseCategory, CourseDataType, GroundType, LocalizationData,
} from '../../library/common';
import CourseData from '../course-data';
import CourseChart from './course-chart';

import 'react-tabs/style/react-tabs.css';

import courseJson from '../../db/course.json';

const courses = courseJson as CourseDataType[];

interface IProps {
  localization: LocalizationData
}

interface IState {
  racecourse?: string,
  ground?: GroundType,
  distance?: number,
  course?: CourseDataType,
}

class Course extends Component<IProps, IState> {
  private courseCategories: CourseCategory = {};

  constructor(props: IProps) {
    super(props);

    this.loadCourseData();
    this.state = {
      racecourse: '10006',
      ground: GroundType.Turf,
      distance: 1600,
      course: this.courseCategories['10006'][GroundType.Turf][1600],
    };
  }

  setData = (key: string, value: any): void => {
    this.setState({ [key]: value } as Pick<IState, keyof IState>, this.updateCourse);
  };

  updateCourse = () => {
    const { racecourse, ground, distance } = this.state;
    if (racecourse === undefined || ground === undefined || distance === undefined) {
      this.setState({ course: undefined });
    } else {
      this.setState({ course: this.courseCategories[racecourse][ground][distance] });
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
    return (
      <div className="content">
        <CourseData
          localization={localization}
          courseCategories={this.courseCategories}
          setData={this.setData}
          state={this.state}
        />
        <CourseChart
          localization={localization}
          state={this.state}
        />
      </div>
    );
  }
}

export default Course;
