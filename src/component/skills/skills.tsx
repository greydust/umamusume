import React, { useState, useEffect } from 'react';

import skill_data from '../../db/skill_data.json'

interface IProps {
  localization: { [key: string]: string };
}

interface Skill {
  ID : number,
  Name: string,
  Condition1: string,
  TimeKeep1: number,
  CD1: number,
  Effect1 : {
      ParamType1: string, 
      ParamValue1: number, 
      TargetType1: string, 
      TargetValue1: number, 
      ParamType2: string, 
      ParamValue2: number, 
      TargetType2: string, 
      TargetValue2: number, 
      ParamType3: string, 
      ParamValue3: number, 
      TargetType3: string, 
      TargetValue3: number
  },
  Effect2: {
      Condition2: string, 
      TimeKeep2: number, 
      CD2: number, 
      ParamType1: string, 
      ParamValue1: number, 
      TargetType1: string, 
      TargetValue1: number, 
      ParamType2: string, 
      ParamValue2: number, 
      TargetType2: string, 
      TargetValue2: number, 
      ParamType3: string, 
      ParamValue3: number, 
      TargetType3: string, 
      TargetValue3: number
  },
  PopularityParam1: string, 
  PopularityBonus1: string, 
  PopularityParam2: string, 
  PopularityBonus2: string    

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
    return skills.map((value, index) => 
    <tr key={index}>
      <td>{value['ID']}</td>
      <td>{value['Name']}</td>
      <td>{value['Condition1']}</td>
      <td>{value['TimeKeep1']}</td>
      <td>{value['CD1']}</td>

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
