import React, { useState } from 'react';

import skill_data from '../../db/skill.json';
import { Skill } from './common';
import SkillItem from './skill-item';

interface IProps {
}

function Skills(props: IProps) {
  const [skills, setSkills] = useState(initSkills);
  const [effectFilter, setEffectFilter] = useState([]);

  function initSkills() {
    const data = skill_data;
    const skillArray: Skill[] = [];
    data.forEach((skill) => {
      skillArray.push({
        name: skill.name,
        need_skill_point: skill.need_skill_point,
        description: skill.description,
        id: skill.id,
        rarity: skill.rarity,
        grade_value: skill.grade_value,
      });
    });
    return skillArray;
  }

  const options = () => '';

  const skillTable = () => skills.map((skill, index) => (<SkillItem skill={skill} />));

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
