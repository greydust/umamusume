import React, { useState } from 'react';

import skill_data from '../../db/skill.json';

interface IProps {
}

interface Skill {
  name: string,
  need_skill_point: string,
  description: string,
  id: string,
  rarity: string,
  group_id: string,
  group_rate: string,
  filter_switch: string,
  grade_value: string,
  skill_category: string,
  tag_id: string,
  unique_skill_id_1: string,
  unique_skill_id_2: string,
  exp_type: string,
  potential_per_default: string,
  activate_lot: string,
  condition_1: string,
  float_ability_time_1: string,
  float_cooldown_time_1: string,
  ability_type_1_1: string,
  ability_value_usage_1_1: string,
  ability_value_level_usage_1_1: string,
  float_ability_value_1_1: string,
  target_type_1_1: string,
  target_value_1_1: string,
  ability_type_1_2: string,
  ability_value_usage_1_2: string,
  ability_value_level_usage_1_2: string,
  float_ability_value_1_2: string,
  target_type_1_2: string,
  target_value_1_2: string,
  ability_type_1_3: string,
  ability_value_usage_1_3: string,
  ability_value_level_usage_1_3: string,
  float_ability_value_1_3: string,
  target_type_1_3: string,
  target_value_1_3: string,
  condition_2: string,
  float_ability_time_2: string,
  float_cooldown_time_2: string,
  ability_type_2_1: string,
  ability_value_usage_2_1: string,
  ability_value_level_usage_2_1: string,
  float_ability_value_2_1: string,
  target_type_2_1: string,
  target_value_2_1: string,
  ability_type_2_2: string,
  ability_value_usage_2_2: string,
  ability_value_level_usage_2_2: string,
  float_ability_value_2_2: string,
  target_type_2_2: string,
  target_value_2_2: string,
  ability_type_2_3: string,
  ability_value_usage_2_3: string,
  ability_value_level_usage_2_3: string,
  float_ability_value_2_3: string,
  target_type_2_3: string,
  target_value_2_3: string,
  popularity_add_param_1: string,
  popularity_add_value_1: string,
  popularity_add_param_2: string,
  popularity_add_value_2: string,
  disp_order: string,
  icon_id: string,
}

function Skills(props: IProps) {
  const [skills, setSkills] = useState(initSkills);
  const [effectFilter, setEffectFilter] = useState([]);

  function initSkills() {
    const data = skill_data;
    const skillArray: Skill[] = [];
    data.forEach((skill) => {
      skillArray.push(skill);
    });
    return skillArray;
  }

  const options = () => '';

  const skillTable = () => skills.map((value, index) => (
    <tr key={`skill_${value.id}`}>
      <td>{value.id}</td>
      <td>{value.name}</td>
      <td>{value.condition_1}</td>
      <td>{value.float_ability_time_1}</td>
      <td>{value.float_cooldown_time_1}</td>
    </tr>
  ));

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
