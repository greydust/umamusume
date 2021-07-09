import React, { useState, useEffect, useContext } from 'react';
import { DataContext } from '../../data-context';

import { Skill } from './common';
import SkillItem from './skill-item';

// import skill_data from '../../db/skill.json';
// import skill_new from '../../db/skill/overview/general.json';

import '../../app.css';

interface IProps {
}

function Skills(props: IProps) {

  const {data, setData, initData} = useContext(DataContext);

  const [skills, setSkills] = useState(() => {    
    if (Object.keys(data.skill.detail).length == 0) {
      initData("skill");
    } else if (!("general" in data.skill.overview)) { 
      setData("skill", "general");
    }
    return data.skill.overview.general;
  });

  const [runningStyle, setRunningStyle] = useState(["逃げ","先行", "差し", "追込"]);
  const [phase, setPhase] = useState(["序盤","中盤", "終盤"]);
  const [option, setOption] = useState({phase: "全部", runningStyle: "全部"});



  const filterButton = (objects: any, label: string) => {
    let tmp = [<label>
                <input type='radio' name={label} value='all' checked/>
                全部
              </label>];
    tmp.push(objects.map( (value:any) => (
      <label key={value}>
        <input type="radio" id={value} name={label} value={value}/>
        {value}
      </label>
    )));
    tmp.push(<br/>);
    return tmp;
  }

  

  return (
    <div className="content">
      <form>
        {filterButton(phase, "phase")}
        {filterButton(runningStyle, "runningStyle")}

      </form>
      <table>
        <thead></thead>
        <tbody>
        { 
          skills && 
          skills.map((skill:any) => <SkillItem key={skill.id} skill={skill} />) 
        }
        </tbody>
      </table>
    </div>
  );
}

export default Skills;
