import _ from 'lodash';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import React, { Component } from 'react';

import '../../app.css';
import './relation.css';

import characterJson from '../../db/character.json';
import relation from '../../db/relation.json';
import relationMember from '../../db/relation_member.json';

class RelationQuery extends Component {
  static calculateRelation(id1, id2) {
    if (id1 === id2) {
      return 0;
    }
    const relations = _.intersection(relationMember[id1], relationMember[id2]);
    return _.reduce(relations, (sum, id) => sum + parseInt(relation[id], 10), 0);
  }

  constructor(props) {
    super(props);
    this.horses = Object.entries(characterJson);
    this.state = {
      horse: {},
    };
  }

  selectHorse = (event) => {
    const { value } = event.target;
    this.setState({ horse: { id: value[0], name: value[1].text } });
  };

  buildRelationArray() {
    const { horse } = this.state;
    const { localization } = this.props;
    let rel = [];
    this.horses.forEach((horseOther) => {
      if (horseOther[0] !== horse.id) {
        rel.push([
          localization[horseOther[1].text],
          RelationQuery.calculateRelation(horse.id, horseOther[0]),
          `${process.env.PUBLIC_URL}/static/image/character/portrait/${horseOther[0]}.png`,
        ]);
      }
    });
    rel = _.sortBy(rel, [(value) => -value[1]]);

    return rel.map((value, index) => (
      <tr key={index[1]}>
        <td>{value[0]}</td>
        <td>{value[1]}</td>
        <td><img className="portrait" src={value[2]} alt={value[1]} /></td>
      </tr>
    ));
  }

  render() {
    const { horse } = this.state;
    const { localization } = this.props;
    const relationArray = this.buildRelationArray();
    return (
      <div className="content">
        <div className="dropdown">
          <FormControl>
            <InputLabel id="demo-simple-select-label">ウマ</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={horse[1]}
              onChange={this.selectHorse}
            >
              { this.horses.map((targetHorse, index) => (
                <MenuItem key={`${index[1]}_option`} value={targetHorse}>
                  <img
                    className="portrait"
                    src={`${process.env.PUBLIC_URL}/static/image/character/portrait/${targetHorse[0]}.png`}
                    alt={localization[targetHorse[1].text]}
                  />
                  {localization[targetHorse[1].text]}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </div>
        <table>
          {relationArray}
        </table>
      </div>
    );
  }
}

export default RelationQuery;
