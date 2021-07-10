import React, { useState, useEffect, useContext, useCallback  } from 'react';
import { DataContext } from '../../data-context';

import _ from 'lodash';

import { Skill } from './common';
import SkillItem from './skill-item';

import '../../app.css';


import i18next from 'i18next';


interface IProps {
}

function Skills(props: IProps) {

  const {data, initData} = useContext(DataContext);

  const [skills, setSkills] = useState(() => {    
    if (!("general" in data.skill.overview)) { 
      initData("skill", "general");
    }
    return data.skill.overview.general;
  });

  const [runningStyle, setRunningStyle] = useState({
    "不限": -1,
    "逃げ": 1,
    "先行": 2,
    "差し": 3,
    "追込": 4,
  });
  const [phase, setPhase] = useState({
    "不限": -1,
    "序盤": 0,
    "中盤": 1, 
    "終盤": 2
  });
  const [option, setOption] = useState({
    phase: -1, 
    // phase_random: -1, 
    running_style: -1
  });

  const onChange = useCallback(e => {
    let tmp: any = {};
    tmp[e.target.name] = parseInt(e.target.value);
    setOption(
      Object.assign(
        {}, 
        option,
        tmp
      )
    )
  } , [])

  const filterButton = (objects: any, label: string) => {
    let tmp = Object.entries(objects).map((obj:any) => (
      <label key={obj[0]}>
        <input type="radio" id={obj[1]} name={label} value={obj[1]} onChange={onChange}/>
        {obj[0]}
      </label>
    ));
    return tmp;
  }

  return (
    <div className="content">
      <form>
        {filterButton(phase, "phase")} <br/>
        {filterButton(runningStyle, "running_style")}
      </form>
      <table>
        <thead></thead>
        <tbody>
        { 
          skills && 
          skills
            .filter((skill:any)=> (skill.tag.phase === option.phase || skill.tag.phase_random === option.phase) && skill.tag.running_style === option.running_style)
            .map((skill:any) => <SkillItem key={skill.id} skill={skill} />) 
        }
        </tbody>
      </table>
    </div>
  );
}

export default Skills;
