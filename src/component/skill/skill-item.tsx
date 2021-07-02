import React, { useState } from 'react';

import { Skill } from './common';

interface Props {
  skill: Skill,
}

const SkillItem: React.FC<Props> = (props) => {
  const { skill: propSkill } = props;
  const [skill, setSkill] = useState(propSkill);

  const gradeRate = () => ((!skill.need_skill_point) ? skill.grade_value : (skill.grade_value / skill.need_skill_point).toFixed(2));

  return (
    <tr>
      <td>{skill.id}</td>

      <td>{skill.name}</td>
      <td>{skill.description}</td>
      <td>{skill.rarity}</td>
      <td>{skill.need_skill_point}</td>
      <td>{skill.grade_value}</td>
      <td>{gradeRate()}</td>

    </tr>
  );
};

export default SkillItem;
