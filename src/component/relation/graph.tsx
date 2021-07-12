import _ from 'lodash';
import React, { Component } from 'react';
import 'react-tabs/style/react-tabs.css';

import '../../app.css';
import './graph.css';

import characterJson from '../../db/character.json';
import relationJson from '../../db/relation.json';
import relationMemberJson from '../../db/relation_member.json';

const characters = characterJson as { [key: string]: { text: string } };
const relations = relationJson as { [key: string]: string };
const relationMembers = relationMemberJson as { [key: string]: string[] };

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
    const targetRelations: string[] = _.intersection(relationMembers[id1], relationMembers[id2]);
    return _.reduce(targetRelations, (sum: number, id: string) => sum + parseInt(relations[id], 10), 0);
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
        { _.map(this.characterIds, (targetId) => <td className="text1">{ RelationGraph.calculateRelation(id, targetId) }</td>) }
      </tr>
    );
  }

  idToPortrait(id: string) {
    const { localization } = this.props;
    return (
      <img
        className="portrait"
        src={`${process.env.PUBLIC_URL}/static/image/character/portrait/${id}.png`}
        alt={localization[characters[id].text]}
      />
    );
  }

  render() {
    return (
      <div className="content">
        <table>
          <tbody>
            <tr>
              <td />
              { _.map(this.characterIds, (id) => <td>{this.idToPortrait(id)}</td>) }
            </tr>
            { _.map(this.characterIds, (id) => this.createRow(id)) }
          </tbody>
        </table>
      </div>
    );
  }
}

export default RelationGraph;
