import _ from 'lodash';
import React, { Component } from 'react';
import 'react-tabs/style/react-tabs.css';

import characterJson from '../../db/character.json';
import relation from '../../db/relation.json';
import relationMember from '../../db/relation_member.json';

class Relation extends Component {
  static calculateRelation(id1, id2) {
    if (id1 === id2) {
      return 0;
    }
    const relations = _.intersection(relationMember[id1], relationMember[id2]);
    return _.reduce(relations, (sum, id) => sum + parseInt(relation[id], 10), 0);
  }

  static idToPortrait(id) {
    return (
      <img
        className="portrait"
        src={`${process.env.PUBLIC_URL}/static/image/character/portrait/${id}.png`}
        alt={characterJson[id].text}
      />
    );
  }

  constructor(props) {
    super(props);
    this.characterIds = Object.keys(characterJson);
    this.relations = {};
    for (let i = 0; i < this.characterIds.length; i += 1) {
      this.relations[this.characterIds[i]] = {};
      for (let j = 0; j < this.characterIds.length; j += 1) {
        this.relations[this.characterIds[i]][this.characterIds[j]] = Relation.calculateRelation(
          this.characterIds[i], this.characterIds[j],
        );
      }
    }
  }

  createRow(id) {
    return (
      <tr>
        <th>{Relation.idToPortrait(id)}</th>
        { _.map(this.characterIds, (targetId) => <th>{ Relation.calculateRelation(id, targetId) }</th>) }
      </tr>
    );
  }

  render() {
    return (
      <table>
        <tbody>
          <tr>
            <th />
            { _.map(this.characterIds, (id) => <th>{Relation.idToPortrait(id)}</th>) }
          </tr>
          { _.map(this.characterIds, (id) => this.createRow(id)) }
        </tbody>
      </table>
    );
  }
}

export default Relation;