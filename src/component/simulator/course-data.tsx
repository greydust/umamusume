import _ from 'lodash';
import {
  Row, Col, Select,
} from 'antd';
import React, { Component } from 'react';

import {
  CourseCategory, CourseDataType, GroundStatus, LocalizationData, RunningStyle,
} from '../../common';

import 'antd/dist/antd.css';
import './simulator.css';

const { Option } = Select;

interface IProps {
  localization: LocalizationData,
  courseCategories: CourseCategory,
  setData: (key: string, value: any) => void,
  state: {
    strategy?: string,
    groundStatus?: string,
    racecourse?: string,
    ground?: string,
    distance?: number,
    course?: CourseDataType,
  },
}

interface IState {
}

class CourseData extends Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);
    this.state = {
    };
  }

  getStrategyComponent() {
    const { localization, setData, state } = this.props;
    const { strategy } = state;
    return (
      <Col span={4}>
        <div className="flex">
          <span className="select-label">{`${localization.site.Strategy}:`}</span>
          <Select className="select" value={strategy} onChange={(value) => setData('strategy', value)}>
            <Option value={RunningStyle.Nige}>{localization.site.RunningStyleNige}</Option>
            <Option value={RunningStyle.Senko}>{localization.site.RunningStyleSenko}</Option>
            <Option value={RunningStyle.Sashi}>{localization.site.RunningStyleSashi}</Option>
            <Option value={RunningStyle.Oikomi}>{localization.site.RunningStyleOikomi}</Option>
          </Select>
        </div>
      </Col>
    );
  }

  getGroundStatusComponent() {
    const { localization, setData, state } = this.props;
    const { groundStatus } = state;
    return (
      <Col span={4}>
        <div className="flex">
          <span className="select-label">{`${localization.site.GroundStatus}:`}</span>
          <Select className="select" value={groundStatus} onChange={(value) => setData('groundStatus', value)}>
            <Option value={GroundStatus.Good}>{localization.site.GroundStatusGood}</Option>
            <Option value={GroundStatus.SlightlyHeavy}>{localization.site.GroundStatusSlightlyHeavy}</Option>
            <Option value={GroundStatus.Heavy}>{localization.site.GroundStatusHeavy}</Option>
            <Option value={GroundStatus.Bad}>{localization.site.GroundStatusBad}</Option>
          </Select>
        </div>
      </Col>
    );
  }

  getRacecourseComponent() {
    const { localization, setData, state } = this.props;
    const { racecourse } = state;
    return (
      <Col span={4}>
        <div className="flex">
          <span className="select-label">{`${localization.site.Racecourse}:`}</span>
          <Select className="select" value={racecourse} onChange={(value) => setData('racecourse', value)}>
            { _.map(localization.course.racecourse, (value: string, key: string) => (
              <Option value={key}>{value}</Option>
            ))}
          </Select>
        </div>
      </Col>
    );
  }

  getGroundComponent() {
    const {
      localization, courseCategories, setData, state,
    } = this.props;
    const { racecourse, ground } = state;

    if (racecourse === undefined) {
      return null;
    }
    return (
      <Col span={4}>
        <div className="flex">
          <span className="select-label">{`${localization.site.Ground}:`}</span>
          <Select className="select" value={ground} onChange={(value) => setData('ground', value)}>
            { _.map(courseCategories[racecourse], (value: string, key: string) => (
              <Option value={key}>{localization.course.ground[key]}</Option>
            ))}
          </Select>
        </div>
      </Col>
    );
  }

  getDistanceComponent() {
    const {
      localization, courseCategories, setData, state,
    } = this.props;
    const { racecourse, ground, distance } = state;

    if (racecourse === undefined || ground === undefined) {
      return null;
    }
    return (
      <Col span={4}>
        <div className="flex">
          <span className="select-label">{`${localization.site.Distance}:`}</span>
          <Select className="select" value={distance} onChange={(value) => setData('distance', value)}>
            { _.map(courseCategories[racecourse][ground], (value: string, key: number) => (
              <Option value={key}>{key}</Option>
            ))}
          </Select>
        </div>
      </Col>
    );
  }

  render() {
    const strategyComponent = this.getStrategyComponent();
    const groundStatusComponent = this.getGroundStatusComponent();
    const racecourseComponent = this.getRacecourseComponent();
    const groundComponent = this.getGroundComponent();
    const distanceComponent = this.getDistanceComponent();

    return (
      <Row gutter={[8, 8]}>
        {strategyComponent}
        {groundStatusComponent}
        {racecourseComponent}
        {groundComponent}
        {distanceComponent}
      </Row>
    );
  }
}

export default CourseData;
