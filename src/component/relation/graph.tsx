import _ from 'lodash';
import React, { Component } from 'react';
import 'react-tabs/style/react-tabs.css';

import '../../app.css';
import './relation.css';

import characterJson from '../../db/character.json';
import relation from '../../db/relation.json';
import relationMember from '../../db/relation_member.json';

interface IProps {
  localization: { [key: string]: string };
}

interface IState {
}

class RelationGraph extends Component<IProps, IState> {
  static calculateRelation(id1: string, id2: string) {
    if (id1 === id2) {
      return 0;
    }
    const relations: string[] = _.intersection(relationMember[id1], relationMember[id2]);
    return _.reduce(relations, (sum: number, id: string) => sum + parseInt(relation[id], 10), 0);
  }

  characterIds: string[];

  relations: { [key: string]: { [key: string]: number } };

  constructor(props: IProps) {
    super(props);
    this.characterIds = Object.keys(characterJson);
    this.relations = {};
    for (let i = 0; i < this.characterIds.length; i += 1) {
      this.relations[this.characterIds[i]] = {};
      for (let j = 0; j < this.characterIds.length; j += 1) {
        this.relations[this.characterIds[i]][this.characterIds[j]] = RelationGraph.calculateRelation(this.characterIds[i], this.characterIds[j]);
      }
    }
  }

  createRow(id: string) {
    return (
      <tr>
        <th>{this.idToPortrait(id)}</th>
        { _.map(this.characterIds, (targetId) => <th>{ RelationGraph.calculateRelation(id, targetId) }</th>) }
      </tr>
    );
  }

  idToPortrait(id: string) {
    const { localization } = this.props;
    return (
      <img
        className="portrait"
        src={`${process.env.PUBLIC_URL}/static/image/character/portrait/${id}.png`}
        alt={localization[characterJson[id].text]}
      />
    );
  }

  render() {
    return (
      <div className="content">
        <table>
          <tbody>
            <tr>
              <th />
              { _.map(this.characterIds, (id) => <th>{this.idToPortrait(id)}</th>) }
            </tr>
            { _.map(this.characterIds, (id) => this.createRow(id)) }
          </tbody>
        </table>
      </div>
    );
  }
}

export default RelationGraph;
