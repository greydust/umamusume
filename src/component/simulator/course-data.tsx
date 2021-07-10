import _ from 'lodash';
import {
  Row, Col, Select,
} from 'antd';
import React, { Component } from 'react';

import {
  CourseCategory, CourseDataType, GroundStatus, LocalizationData, RunningStyle,
} from '../../library/common';

import 'antd/dist/antd.css';
import './simulator.css';

const { Option } = Select;


import i18next from 'i18next';




interface IProps {
  // localization: LocalizationData,
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
    const { setData, state } = this.props;
    const { strategy } = state;
    return (
      <Col span={4}>
        <div className="flex">
          <span className="select-label">{`${i18next.t('Strategy')}:`}</span>
          <Select className="select" value={strategy} onChange={(value) => setData('strategy', value)}>
            <Option value={RunningStyle.Nige}>{i18next.t('RunningStyleNige')}</Option>
            <Option value={RunningStyle.Senko}>{i18next.t('RunningStyleSenko')}</Option>
            <Option value={RunningStyle.Sashi}>{i18next.t('RunningStyleSashi')}</Option>
            <Option value={RunningStyle.Oikomi}>{i18next.t('RunningStyleOikomi')}</Option>
          </Select>
        </div>
      </Col>
    );
  }

  getGroundStatusComponent() {
    const { setData, state } = this.props;
    const { groundStatus } = state;
    return (
      <Col span={4}>
        <div className="flex">
          <span className="select-label">{`${i18next.t('GroundStatus')}:`}</span>
          <Select className="select" value={groundStatus} onChange={(value) => setData('groundStatus', value)}>
            <Option value={GroundStatus.Good}>{i18next.t('GroundStatusGood')}</Option>
            <Option value={GroundStatus.SlightlyHeavy}>{i18next.t('GroundStatusSlightlyHeavy')}</Option>
            <Option value={GroundStatus.Heavy}>{i18next.t('GroundStatusHeavy')}</Option>
            <Option value={GroundStatus.Bad}>{i18next.t('GroundStatusBad')}</Option>
          </Select>
        </div>
      </Col>
    );
  }

  getRacecourseComponent() {
    const { setData, state } = this.props;
    const { racecourse } = state;
    return (
      <Col span={4}>
        <div className="flex">
          <span className="select-label">{`${i18next.t('Racecourse')}:`}</span>
{/*          <Select className="select" value={racecourse} onChange={(value) => setData('racecourse', value)}>
            { _.map(localization.course.racecourse, (value: string, key: string) => (
              <Option value={key}>{value}</Option>
            ))}
          </Select>*/}
        </div>
      </Col>
    );
  }

  getGroundComponent() {
    const {
      courseCategories, setData, state,
    } = this.props;
    const { racecourse, ground } = state;

    if (racecourse === undefined) {
      return null;
    }
    return (
      <Col span={4}>
        <div className="flex">
          <span className="select-label">{`${i18next.t('Ground')}:`}</span>
          <Select className="select" value={ground} onChange={(value) => setData('ground', value)}>
            { _.map(courseCategories[racecourse], (value: string, key: string) => (
              <Option value={key}>{i18next.t('course.ground' + [key])}</Option>
            ))}
          </Select>
        </div>
      </Col>
    );
  }

  getDistanceComponent() {
    const {
      courseCategories, setData, state,
    } = this.props;
    const { racecourse, ground, distance } = state;

    if (racecourse === undefined || ground === undefined) {
      return null;
    }
    return (
      <Col span={4}>
        <div className="flex">
          <span className="select-label">{`${i18next.t('Distance')}:`}</span>
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
