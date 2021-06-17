import _ from 'lodash';
import {
  Form, Row, Col, Select,
} from 'antd';
import React, { Component } from 'react';

const { Option } = Select;

interface IProps {
  localization: { [key: string]: string };
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
    const { localization } = this.props;
    return (
      <div>
        <Form>
          { _.map(HorseProperRate.properRateTypes, (proper, properType) => (
            <div>
              <Row gutter={[8, 8]}><Col span={24}>{localization[properType]}</Col></Row>
              <Row gutter={[8, 8]}>
                { _.map(proper, (properRate, properRateType) => (
                  <Col span={4}>
                    <Form.Item name={properRateType} label={localization[properRate]}>
                      <Select defaultValue="7">
                        { _.map(HorseProperRate.properRate, (value, key) => (
                          <Option value={value}>{localization[key]}</Option>
                        ))}
                      </Select>
                    </Form.Item>
                  </Col>
                ))}
              </Row>
            </div>
          ))}
        </Form>
      </div>
    );
  }
}

export default HorseProperRate;
