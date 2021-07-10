import _ from 'lodash';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import React, { Component } from 'react';

import '../../app.css';
import './relation.css';

import { LocalizationData } from '../../library/common';
import characterJson from '../../db/character.json';
import relationJson from '../../db/relation.json';
import relationMemberJson from '../../db/relation_member.json';

const characters = characterJson as { [key: string]: {} };
const relations = relationJson as { [key: string]: string };
const relationMembers = relationMemberJson as { [key: string]: string[] };



import i18next from 'i18next';




interface HorseRow {
  name: string;
  relation: number;
  image: string;
}

interface IProps {
  // localization: LocalizationData;
}

interface IState {
  horseId: string
}

class RelationQuery extends Component<IProps, IState> {
  static calculateRelation(id1: string | undefined, id2: string): number {
    if (id1 === id2 || id1 === undefined) {
      return 0;
    }
    const targetRelations: string[] = _.intersection(relationMembers[id1], relationMembers[id2]);
    return _.reduce(targetRelations, (sum: number, id: string) => sum + parseInt(relations[id], 10), 0);
  }

  horses: string[];

  constructor(props: IProps) {
    super(props);
    this.horses = Object.keys(characters);
    this.state = {
      horseId: '',
    };
  }

  selectHorse = (event: any) => {
    const { value } = event.target;
    this.setState({ horseId: value });
  };

  buildRelationArray() {
    const { horseId } = this.state;
    let rel: HorseRow[] = [];
    this.horses.forEach((targetHorseId) => {
      if (targetHorseId !== horseId) {
        rel.push({
          name: i18next.t('character.name.' + targetHorseId),
          relation: RelationQuery.calculateRelation(horseId, targetHorseId),
          image: `${process.env.PUBLIC_URL}/static/image/character/portrait/${targetHorseId}.png`,
        });
      }
    });
    rel = _.sortBy(rel, [(horseRow) => -horseRow.relation]);

    return rel.map((horseRow) => (
      <tr>
        <td>{horseRow.name}</td>
        <td><img className="portrait" src={horseRow.image} alt={horseRow.name} /></td>
        <td>{horseRow.relation}</td>
      </tr>
    ));
  }

  render() {
    const relationArray = this.buildRelationArray();
    return (
      <div className="content">
        <div className="dropdown">
          <FormControl>
            <InputLabel id="demo-simple-select-label">ウマ</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              onChange={this.selectHorse}
            >
              { this.horses.map((targetHorseId) => (
                <MenuItem key={`${targetHorseId}_option`} value={targetHorseId}>
                  <img
                    className="portrait"
                    src={`${process.env.PUBLIC_URL}/static/image/character/portrait/${targetHorseId}.png`}
                    alt={i18next.t('character.name.' + targetHorseId)}
                  />
                  {i18next.t('character.name.' + targetHorseId)}
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
