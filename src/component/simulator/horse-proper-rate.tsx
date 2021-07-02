import _ from 'lodash';
import { Row, Col, Select } from 'antd';
import React, { Component } from 'react';

import { LocalizationData } from '../../library/common';

import './simulator.css';

interface IProps {
  localization: LocalizationData;
  setData: (key: string, value: any) => void,
  state: { [key: string]: string },

}

interface IState {
}

class HorseProperRate extends Component<IProps, IState> {
  static readonly properRateTypes = {
    GroundType: ['GroundTypeTurf', 'GroundTypeDirt'],
    DistanceType: ['DistanceTypeShort', 'DistanceTypeMile', 'DistanceTypeMiddle', 'DistanceTypeLong'],
    RunningStyle: ['RunningStyleNige', 'RunningStyleSenko', 'RunningStyleSashi', 'RunningStyleOikomi'],
  };

  static readonly properRate = {
    G: '1',
    F: '2',
    E: '3',
    D: '4',
    C: '5',
    B: '6',
    A: '7',
    S: '8',
  };

  render() {
    const { localization, setData, state } = this.props;
    return (
      <>
        { _.map(HorseProperRate.properRateTypes, (properTypes, properName) => (
          <>
            <Row gutter={[8, 8]}><Col span={24}>{localization.site[properName]}</Col></Row>
            <Row gutter={[8, 8]}>
              { _.map(properTypes, (properRateType) => {
                const camelProperRateType = _.camelCase(properRateType);
                return (
                  <Col span={4}>
                    <div className="flex">
                      <span className="select-label">{`${localization.site[properRateType]}:`}</span>
                      <Select className="select" value={state[camelProperRateType]} onChange={(value) => setData(camelProperRateType, value)}>
                        { _.map(HorseProperRate.properRate, (value, key) => (
                          <Select.Option value={value}>{localization.site[key]}</Select.Option>
                        ))}
                      </Select>
                    </div>
                  </Col>
                );
              })}
            </Row>
          </>
        ))}
      </>
    );
  }
}

export default HorseProperRate;
