import _ from 'lodash';
import { InputNumber, Row, Col } from 'antd';
import React, { Component } from 'react';

import { LocalizationData } from '../../library/common';

import '../component.css';

interface IProps {
  localization: LocalizationData;
  setData: (key: string, value: any) => void,
  state: { [key: string]: number },
}

interface IState {
}

class HorseStatData extends Component<IProps, IState> {
  static readonly stats = {
    speed: 'Speed',
    stamina: 'Stamina',
    pow: 'Power',
    guts: 'Guts',
    wiz: 'Wiz',
  };

  render() {
    const { localization, setData, state } = this.props;
    return (
      <Row gutter={[8, 8]}>
        { _.map(HorseStatData.stats, (value, key) => (
          <Col span={4}>
            <div className="flex">
              <span className="select-label">{`${localization.site[value]}:`}</span>
              <InputNumber className="select" value={state[key]} min={1} max={1200} onChange={(data) => setData(key, data)} />
            </div>
          </Col>
        ))}
      </Row>
    );
  }
}

export default HorseStatData;
