import {
  Row, Col, Select,
} from 'antd';
import React, { Component } from 'react';

import {
  GroundStatus, LocalizationData, RunningStyle,
} from '../../library/common';

import 'antd/dist/antd.css';
import '../component.css';

const { Option } = Select;

interface IProps {
  localization: LocalizationData,
  setData: (key: string, value: any) => void,
  state: {
    strategy?: string,
    groundStatus?: string,
  },
}

interface IState {
}

class RaceData extends Component<IProps, IState> {
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

  render() {
    const strategyComponent = this.getStrategyComponent();
    const groundStatusComponent = this.getGroundStatusComponent();

    return (
      <Row gutter={[8, 8]}>
        {strategyComponent}
        {groundStatusComponent}
      </Row>
    );
  }
}

export default RaceData;
