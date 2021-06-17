import React, { useState, useEffect } from 'react';

import skill_data from '../../db/skill_data.json'
// import _ from 'lodash';

// import './App.css';

function Skills() {

  const [skills, setSkills] = useState(initSkills)
  const [effectFilter, setEffectFilter] = useState([])

  function initSkills() {
    var data = skill_data
    var skill_array = []
    data.forEach((skill) => {
      skill_array.push(skill)
    })
    return skill_array

  }

  const options = () => {
    return ""
  }

  const skillTable = () => {
    let tmp;

    console.log(skills)
    return skills.filter((value) => value['Effect'])
                  .map((value, index) => 
                    <tr key={index}>
                      <td>{value['ID']}</td>
                      <td>{value['Name']}</td>
                      <td>{value['Description']}</td>
                      <td>{value['Condition']}</td>
                      <td>{value['TimeKeep']}</td>
                      <td>{value['Grade']}</td>
                      <td>{value['EffectType1']}</td>
                      <td>{value['EffectValue1']}</td>
                      <td>{value['EffectType2']}</td>
                      <td>{value['EffectValue2']}</td>
                      <td>{value['EffectType3']}</td>
                      <td>{value['EffectValue3']}</td>
                      <td>{value['EffectType4']}</td>
                      <td>{value['EffectValue4']}</td>
                      <td>{value['EffectType5']}</td>
                      <td>{value['EffectValue5']}</td>

                    </tr>);
  }

  return (
    <div>
      {options()}
      <table>
        {skillTable()}
      </table>
      




    </div>
  );

}

export default Skills;
