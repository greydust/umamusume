import { Layout, Menu, Select } from 'antd';
import React, { Component } from 'react';
import {
  Redirect, HashRouter as Router, Route, Link, Switch,
} from 'react-router-dom';

import RelationGraph from './component/relation/graph';
import RelationQuery from './component/relation/query';
import Simulator from './component/simulator/simulator';
import Localization from './localization';

import 'antd/dist/antd.css';
import './app.css';

const { Header, Content, Footer } = Layout;
const { Option } = Select;

class App extends Component {
  constructor(props) {
    super(props);
    this.localization = new Localization();
    this.state = {
      localization: this.localization.getLocalization('ja-jp'),
    };
    this.changeLocalization = this.changeLocalization.bind(this);
  }

  changeLocalization(locale) {
    this.setState({
      localization: this.localization.getLocalization(locale),
    });
  }

  render() {
    const { localization } = this.state;
    return (
      <Router>
        <Layout className="layout">
          <Header className="header">
            <Menu theme="dark" mode="horizontal" defaultSelectedKeys={['1']}>
              <Menu.Item key="1">
                <Link to="/relation/graph" className="link">{localization['Relation Graph']}</Link>
              </Menu.Item>
              <Menu.Item key="2">
                <Link to="/relation/query" className="link">{localization['Relation Query']}</Link>
              </Menu.Item>
              <Menu.Item key="3">
                <Link to="/simulator" className="link">{localization.Simulator}</Link>
              </Menu.Item>
            </Menu>
          </Header>
          <Content className="tabs">
            <Switch>
              <Route exact path="/">
                <Redirect to="/relation" />
              </Route>
              <Route path="/relation/graph" component={RelationGraph} localization={localization} />
              <Route path="/relation/query" component={RelationQuery} localization={localization} />
              <Route path="/simulator" component={Simulator} localization={localization} />
            </Switch>
          </Content>
          <Footer className="footer">
            <Select className="localizationSelector" defaultValue="ja-jp" onChange={this.changeLocalization}>
              <Option value="zh-tw">繁體中文</Option>
              <Option value="ja-jp">日本語</Option>
              <Option value="en-us">English</Option>
            </Select>
          </Footer>
        </Layout>
      </Router>
    );
  }
}

export default App;
