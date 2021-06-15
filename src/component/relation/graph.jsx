import _ from 'lodash';
import React from 'react';
import 'react-tabs/style/react-tabs.css';

import './relation.css';

import characterJson from '../../db/character.json';
import relation from '../../db/relation.json';
import relationMember from '../../db/relation_member.json';

function RelationGraph() {
  function calculateRelation(id1, id2) {
    if (id1 === id2) {
      return 0;
    }
    const relations = _.intersection(relationMember[id1], relationMember[id2]);
    return _.reduce(relations, (sum, id) => sum + parseInt(relation[id], 10), 0);
  }

  function idToPortrait(id) {
    return (
      <img
        className="portrait"
        src={`${process.env.PUBLIC_URL}/static/image/character/portrait/${id}.png`}
        alt={characterJson[id].text}
      />
    );
  }

  function createRow(id) {
    return (
      <tr>
        <th>{idToPortrait(id)}</th>
        { _.map(characterIds, (targetId) => <th>{ calculateRelation(id, targetId) }</th>) }
      </tr>
    );
  }

  const characterIds = Object.keys(characterJson);
  const relations = {};
  for (let i = 0; i < characterIds.length; i += 1) {
    relations[characterIds[i]] = {};
    for (let j = 0; j < characterIds.length; j += 1) {
      relations[characterIds[i]][characterIds[j]] = calculateRelation(characterIds[i], characterIds[j]);
    }
  }

  return (
    <div className="content">
      <table>
        <tbody>
          <tr>
            <th />
            { _.map(characterIds, (id) => <th>{idToPortrait(id)}</th>) }
          </tr>
          { _.map(characterIds, (id) => createRow(id)) }
        </tbody>
      </table>
    </div>
  );
}

export default RelationGraph;
