import { Layout, Menu, Select } from 'antd';
import React, { Component, useState } from 'react';
import {
  Redirect, HashRouter as Router, Route, Link, Switch,
} from 'react-router-dom';

// import { LocalizationData } from './library/common';

// import Localization from './localization';

import i18next from 'i18next';

import RelationGraph from './component/relation/graph';
import RelationQuery from './component/relation/query';
import Simulator from './component/simulator/simulator';
import Skill from './component/skill/index';


import { DataContext } from './data-context';
import ENV from './env';

import 'antd/dist/antd.css';
import './app.css';

const { Header, Content, Footer } = Layout;
const { Option } = Select;






interface IProps {
}

interface IState {
}

type InitData = (dataType: string, fileName: string) => void;



const App: React.FC = () => {

  const [data, setData] = useState(() => {
    let tmp:any = {};
    ENV.avalData.forEach((name: string) => {
      tmp[name] = {
        overview: {},
        detail: {}
      };
    })
    return tmp;

  });
  const [avalData, setAvalData] = useState(ENV.avalData);

  const initData: InitData = (dataType, fileName) => {
    if (!avalData.includes(dataType)) {
      console.log("error", dataType);
    }
    let tmp: any = data[dataType];

    if (Object.keys(tmp.detail).length == 0) {
      tmp["detail"] = require('./db/' + dataType + '/detail.json'); 
    }

    if (fileName != "") {
      tmp["overview"][fileName] = require('./db/' + dataType + '/overview/' + fileName + '.json');
    }

    setData(Object.assign({}, data, Object.assign({}, data[dataType], tmp)));
  }

  return (
    <Router>
      <Layout className="layout">
        <Header className="header">
          <Menu theme="dark" mode="horizontal" defaultSelectedKeys={['1']}>
            <Menu.Item key="1">
              <Link to="/relation/graph" className="link">{i18next.t('Relation Graph')}</Link>
            </Menu.Item>
            <Menu.Item key="2">
              <Link to="/relation/query" className="link">{i18next.t('Relation Query')}</Link>
            </Menu.Item>
            <Menu.Item key="3">
              <Link to="/simulator" className="link">{i18next.t('Simulator')}</Link>
            </Menu.Item>
            <Menu.Item key="4">
              <Link to="/skill" className="link">{i18next.t('Skill')}</Link>
            </Menu.Item>
          </Menu>
        </Header>
        <Content className="tabs">
          <Switch>
            <Route exact path="/">
              <Redirect to="/relation/graph" />
            </Route>
            <Route path="/relation/graph" component={RelationGraph} />
            <Route path="/relation/query" component={RelationQuery} />
            <Route path="/simulator" component={Simulator} />

            <DataContext.Provider value={{ data, initData }}>
              <Route path="/skill" component={Skill} />
            </DataContext.Provider>

          </Switch>
        </Content>
      </Layout>
    </Router>
  )



}

export default App;
