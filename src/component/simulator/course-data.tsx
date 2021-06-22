import _ from 'lodash';
import {
  Form, Row, Col, Select,
} from 'antd';
import React, { Component } from 'react';

import { CourseCategory, LocalizationData } from '../../common';

import 'antd/dist/antd.css';
import './course-data.css';

const { Option } = Select;

interface IProps {
  localization: LocalizationData,
  courseCategories: CourseCategory,
}

interface IState {
  racecourse?: string,
  ground?: string,
  distance?: string,
}

class CourseData extends Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);
    this.state = {
    };
  }

  getRacecourseComponent() {
    const { racecourse } = this.state;
    const { localization } = this.props;
    return (
      <Col span={4}>
        <div className="flex">
          <span className="select-label">{`${localization.site.Racecourse}:`}</span>
          <Select className="select" value={racecourse} onChange={this.selectRacecourse}>
            { _.map(localization.course.racecourse, (value: string, key: string) => (
              <Option value={key}>{value}</Option>
            ))}
          </Select>
        </div>
      </Col>
    );
  }

  getGroundComponent() {
    const { racecourse, ground } = this.state;
    if (racecourse === undefined) {
      return null;
    }

    const { localization, courseCategories } = this.props;
    return (
      <Col span={4}>
        <div className="flex">
          <span className="select-label">{`${localization.site.Ground}:`}</span>
          <Select className="select" value={ground} onChange={this.selectGround}>
            { _.map(courseCategories[racecourse], (value: string, key: string) => (
              <Option value={key}>{localization.course.ground[key]}</Option>
            ))}
          </Select>
        </div>
      </Col>
    );
  }

  getDistanceComponent() {
    const { racecourse, ground, distance } = this.state;
    if (racecourse === undefined || ground === undefined) {
      return null;
    }

    const { localization, courseCategories } = this.props;
    return (
      <Col span={4}>
        <div className="flex">
          <span className="select-label">{`${localization.site.Distance}:`}</span>
          <Select className="select" value={distance} onChange={this.selectDistance}>
            { _.map(courseCategories[racecourse][ground], (value: string, key: string) => (
              <Option value={key}>{key}</Option>
            ))}
          </Select>
        </div>
      </Col>
    );
  }

  selectRacecourse = (value?: string) => {
    this.setState({
      racecourse: value,
    });
    this.selectGround(undefined);
  };

  selectGround = (value?: string) => {
    this.setState({
      ground: value,
    });
    this.selectDistance(undefined);
  };

  selectDistance = (value?: string) => {
    this.setState({ distance: value });
  };

  render() {
    const racecourseComponent = this.getRacecourseComponent();
    const groundComponent = this.getGroundComponent();
    const distanceComponent = this.getDistanceComponent();

    return (
      <div>
        <Form>
          <Row gutter={[8, 8]}>
            {racecourseComponent}
            {groundComponent}
            {distanceComponent}
          </Row>
        </Form>
      </div>
    );
  }
}

export default CourseData;
