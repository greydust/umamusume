import React, { useState, useEffect } from 'react';

import skill_data from '../../db/skill_data.json'

interface IProps {
  localization: { [key: string]: string };
}

interface Skill {
  ID: string,
  Name: string,
  Description: string,
  Condition: string,
  TimeKeep: string,
  Grade: string,
  Effect: any,
  EffectType1: string,
  EffectValue1: string,
  EffectType2: string,
  EffectValue2: string,  
  EffectType3: string,
  EffectValue3: string,  
  EffectType4: string,
  EffectValue4: string,
  EffectType5: string,
  EffectValue5: string

}

function Skills(props: IProps) {

  const [skills, setSkills] = useState(initSkills)
  const [effectFilter, setEffectFilter] = useState([])

  function initSkills() {
    let data = skill_data
    let skill_array: Skill[] = []
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
