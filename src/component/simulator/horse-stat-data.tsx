import _ from 'lodash';
import {
  Form, InputNumber, Row, Col,
} from 'antd';
import React, { Component } from 'react';

interface IProps {
  localization: { [key: string]: string };
}

interface IState {
}

class HorseStatData extends Component<IProps, IState> {
  static readonly stats: { [key: string]: string } = {
    speed: 'Speed',
    stamina: 'Stamina',
    pow: 'Power',
    guts: 'Guts',
    wiz: 'Wiz',
  };

  render() {
    const { localization } = this.props;
    return (
      <div>
        <Form>
          <Row gutter={[8, 8]}>
            { _.map(HorseStatData.stats, (value, key) => (
              <Col span={4}>
                <Form.Item name={key} label={localization[value]}>
                  <InputNumber min="1" max="1200" />
                </Form.Item>
              </Col>
            ))}
          </Row>
        </Form>
      </div>
    );
  }
}

export default HorseStatData;
