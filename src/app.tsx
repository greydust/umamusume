import {
  Layout, Menu, Select, Row, Col,
} from 'antd';
import React, { Component } from 'react';
import {
  Redirect, HashRouter as Router, Route, Link, Switch,
} from 'react-router-dom';

import { LocalizationData } from './library/common';
import RelationGraph from './component/relation/graph';
import RelationQuery from './component/relation/query';
import Simulator from './component/simulator/simulator';
import Course from './component/course/course';
import Localization from './localization';

import 'antd/dist/antd.css';
import './app.css';

const { Header, Content, Footer } = Layout;
const { Option } = Select;

interface IProps {
}

interface IState {
  localization: LocalizationData,
}

class App extends Component<IProps, IState> {
  localization: Localization;

  constructor(props: {}) {
    super(props);
    this.localization = new Localization();
    this.state = {
      localization: this.localization.getLocalization('ja-jp'),
    };
  }

  changeLocalization = (locale: string) => {
    this.setState({
      localization: this.localization.getLocalization(locale),
    });
  };

  render() {
    const { localization } = this.state;

    return (
      <Router>
        <Layout className="layout">
          <Header className="header">
            <Menu theme="dark" mode="horizontal" defaultSelectedKeys={['1']}>
              <Menu.Item key="1">
                <Link to="/relation/graph" className="link">{localization.site['Relation Graph']}</Link>
              </Menu.Item>
              <Menu.Item key="2">
                <Link to="/relation/query" className="link">{localization.site['Relation Query']}</Link>
              </Menu.Item>
              <Menu.Item key="3">
                <Link to="/course" className="link">{localization.site.Course}</Link>
              </Menu.Item>
              <Menu.Item key="4">
                <Link to="/simulator" className="link">{localization.site.Simulator}</Link>
              </Menu.Item>
            </Menu>
          </Header>
          <Content className="tabs">
            <Switch>
              <Route exact path="/">
                <Redirect to="/relation/graph" />
              </Route>
              <Route path="/relation/graph" render={() => (<RelationGraph localization={localization} />)} />
              <Route path="/relation/query" render={() => (<RelationQuery localization={localization} />)} />
              <Route path="/simulator" render={() => (<Simulator localization={localization} />)} />
              <Route path="/course" render={() => (<Course localization={localization} />)} />
            </Switch>
          </Content>
          <Footer className="footer" style={{ padding: '5px' }}>
            <Row gutter={[8, 8]}>
              <Col span={20} />
              <Col span={2}>
                <a className="github" href="https://github.com/greydust/umamusume" target="_blank" rel="noreferrer">
                  <img src={`${process.env.PUBLIC_URL}/static/image/github.png`} height="30" alt="GitHub" />
                  GitHub
                </a>
              </Col>
              <Col span={2}>
                <Select className="localizationSelector" defaultValue="ja-jp" onChange={this.changeLocalization}>
                  <Option value="zh-tw">繁體中文</Option>
                  <Option value="ja-jp">日本語</Option>
                  <Option value="en-us">English</Option>
                </Select>
              </Col>
            </Row>
          </Footer>
        </Layout>
      </Router>
    );
  }
}

export default App;
