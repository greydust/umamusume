import React, { useState } from 'react';

import skill_data from '../../db/skill.json';
import { SkillItem } from './skill-item';

interface IProps {
}

interface Skill {
    name: string,
    need_skill_point: number | null,
    description: string,
    id: number,
    rarity: number,
    grade_value: number,


}

    // group_id: number,
    // group_rate: number,
    // filter_switch: number,
    // skill_category: number,
    // tag_id: string,
    // unique_skill_id_1: number,
    // unique_skill_id_2: number,
    // exp_type: number,
    // potential_per_default: number,
    // activate_lot: number,
    // condition_1: string,
    // float_ability_time_1: number,
    // float_cooldown_time_1: number,
    // ability_type_1_1: number,
    // ability_value_usage_1_1: number,
    // ability_value_level_usage_1_1: number,
    // float_ability_value_1_1: number,
    // target_type_1_1: number,
    // target_value_1_1: number,
    // ability_type_1_2: number,
    // ability_value_usage_1_2: number,
    // ability_value_level_usage_1_2: number,
    // float_ability_value_1_2: number,
    // target_type_1_2: number,
    // target_value_1_2: number,
    // ability_type_1_3: number,
    // ability_value_usage_1_3: number,
    // ability_value_level_usage_1_3: number,
    // float_ability_value_1_3: number,
    // target_type_1_3: number,
    // target_value_1_3: number,
    // condition_2: string,
    // float_ability_time_2: number,
    // float_cooldown_time_2: number,
    // ability_type_2_1: number,
    // ability_value_usage_2_1: number,
    // ability_value_level_usage_2_1: number,
    // float_ability_value_2_1: number,
    // target_type_2_1: number,
    // target_value_2_1: number,
    // ability_type_2_2: number,
    // ability_value_usage_2_2: number,
    // ability_value_level_usage_2_2: number,
    // float_ability_value_2_2:number,
    // target_type_2_2: number,
    // target_value_2_2: number,
    // ability_type_2_3:number,
    // ability_value_usage_2_3: number,
    // ability_value_level_usage_2_3: number,
    // float_ability_value_2_3: number,
    // target_type_2_3: number,
    // target_value_2_3: number,
    // popularity_add_param_1: number,
    // popularity_add_value_1: number,
    // popularity_add_param_2: number,
    // popularity_add_value_2: number,
    // disp_order: number,
    // icon_id: number



function Skills(props: IProps) {
  const [skills, setSkills] = useState(initSkills);
  const [effectFilter, setEffectFilter] = useState([]);

  function initSkills() {
    const data = skill_data;
    const skillArray: Skill[] = [];
    data.forEach((skill) => {
      skillArray.push({
        "name": skill.name,
        "need_skill_point": skill.need_skill_point,
        "description": skill.description,
        "id": skill.id,
        "rarity": skill.rarity,
        "grade_value": skill.grade_value,

      });
    });
    return skillArray;
  }

  const options = () => '';

  const skillTable = () => skills.map((skill, index) => (<SkillItem skill={skill} /> ));

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
