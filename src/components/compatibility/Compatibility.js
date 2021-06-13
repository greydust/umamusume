import React, { useState, useEffect } from 'react';
import _ from 'lodash';

// import './App.css';

import characterJson from '../../db/character.json';
import relation from '../../db/relation.json';
import relation_member from '../../db/relation_member';

import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';


function Compatibility() {

  const [umas, setUmas] = useState(Object.entries(characterJson));
  const [uma, setUma] = useState({});

  const handleChange = (event) => {
    let value = event.target.value;

    setUma({
      'id': value[0],
      'name': value[1]['text'],
    });
  };

  const relationArray = () => {
    let rel = [];
    umas.forEach((uma_other) => {

      if (uma_other[0] != uma.id) {
        rel.push([uma_other[1].text ,calculateRelation(uma.id, uma_other[0]), 'image/character/portrait/' + uma_other[0] + '.png']);
      };
    });
    rel.sort((a, b) => a[1] < b[1] ? 1 : -1)

    return rel.map((value, index) => 
      <tr key={index}>
        <td>{value[0]}</td>
        <td>{value[1]}</td>
        <td><img src={value[2]} alt={value[1]} /></td>
      </tr>);
  }


  function calculateRelation(id1, id2) {
    if (id1 === id2) {
      return 0;
    }
    const rel = _.intersection(relation_member[id1], relation_member[id2])
    console.log(rel);
    return _.reduce(rel, (sum, id) => sum += parseInt(relation[id]), 0);
  }

  return (
    <div>
      <div class="dropdown">
      <FormControl >
        <InputLabel id="demo-simple-select-label">ウマ</InputLabel>
        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          value={uma[1]}
          onChange={handleChange}
        >
          {umas.map((uma, index) => <MenuItem key={index} value={uma} >{uma[1]['text']}</MenuItem>)}
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
