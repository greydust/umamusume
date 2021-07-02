import React, { useState } from 'react';

import { Skill } from './common';
import SkillItem from './skill-item';

import skill_data from '../../db/skill.json';

import '../../app.css';

interface IProps {
}

function Skills(props: IProps) {
  const [skills, setSkills] = useState(initSkills);
  // const [effectFilter, setEffectFilter] = useState([]);

  function initSkills() {
    const skillArray: Skill[] = [];
    for (const [, skill] of Object.entries(skill_data)) {
      skillArray.push({
        name: skill.name,
        need_skill_point: skill.need_skill_point,
        description: skill.description,
        id: skill.id,
        rarity: skill.rarity,
        grade_value: skill.grade_value,
      });
    }
    return skillArray;
  }

  const options = () => '';

  const skillTable = () => skills.map((skill, index) => (<SkillItem skill={skill} />));

  return (
    <div className="content">
      {options()}
      <table>
        {skillTable()}
      </table>
    </div>
  );
}

export default Skills;
