import _ from 'lodash';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import React, { useState } from 'react';

import characterJson from '../../db/character.json';
import relation from '../../db/relation.json';
import relationMember from '../../db/relation_member.json';

function Compatibility() {
  function calculateRelation(id1, id2) {
    if (id1 === id2) {
      return 0;
    }
    const relations = _.intersection(relationMember[id1], relationMember[id2]);
    return _.reduce(relations, (sum, id) => sum + parseInt(relation[id], 10), 0);
  }

  const [horses] = useState(Object.entries(characterJson));
  const [horse, setUma] = useState({});

  const handleChange = (event) => {
    const { value } = event.target;

    setUma({
      id: value[0],
      name: value[1].text,
    });
  };

  const relationArray = () => {
    let rel = [];
    horses.forEach((horseOther) => {
      if (horseOther[0] !== horse.id) {
        rel.push([
          horseOther[1].text,
          calculateRelation(horse.id, horseOther[0]),
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
  };

  return (
    <div>
      <div className="dropdown">
        <FormControl>
          <InputLabel id="demo-simple-select-label">ウマ</InputLabel>
          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            value={horse[1]}
            onChange={handleChange}
          >
            { horses.map((targetHorse, index) => (
              <MenuItem key={`${index[1]}_option`} value={targetHorse}>{targetHorse[1].text}</MenuItem>
            ))}
          </Select>
        </FormControl>
      </div>
      <table>
        {relationArray()}
      </table>
    </div>
  );
}

export default Compatibility;
