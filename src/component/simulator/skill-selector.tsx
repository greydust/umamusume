import _ from 'lodash';
import React, { Component } from 'react';
import { Row, Col, TreeSelect } from 'antd';

import { LocalizationData, SkillData } from '../../library/common';

import skillJson from '../../db/skill.json';

import 'antd/dist/antd.css';
import '../component.css';

interface SkillSelectorDefinition {
  categoryName: string,
  icon?: string,
  sets: string[],
  children?: SkillSelectorDefinition[],
}

const SKILL_SELECTOR_HIERARCHY: SkillSelectorDefinition[] = [
  {
    categoryName: 'SkillPassive',
    sets: ['10061'],
    children: [
      {
        categoryName: 'Speed',
        icon: '10011',
        sets: ['10011'],
      },
      {
        categoryName: 'Stamina',
        icon: '10021',
        sets: ['10021'],
      },
      {
        categoryName: 'Power',
        icon: '10031',
        sets: ['10031'],
      },
      {
        categoryName: 'Guts',
        icon: '10041',
        sets: ['10041'],
      },
      {
        categoryName: 'Wiz',
        icon: '10051',
        sets: ['10051'],
      },
    ],
  },
  {
    categoryName: 'SkillActive',
    sets: [],
    children: [
      {
        categoryName: 'SkillSpeed',
        icon: '20011',
        sets: ['20011', '20012'],
      },
      {
        categoryName: 'SkillAccel',
        icon: '20041',
        sets: ['20041', '20042'],
      },
      {
        categoryName: 'SkillHeal',
        icon: '20021',
        sets: ['20021', '20022'],
      },
      {
        categoryName: 'SkillLane',
        icon: '20051',
        sets: ['20051', '20052'],
      },
      {
        categoryName: 'SkillSight',
        icon: '20091',
        sets: ['20091', '20092'],
      },
      {
        categoryName: 'SkillGate',
        icon: '20061',
        sets: ['20061', '20062'],
      },
    ],
  },
  {
    categoryName: 'SkillDebuff',
    sets: [],
    children: [
      {
        categoryName: 'SkillSpeed',
        icon: '30011',
        sets: ['30011', '30012'],
      },
      {
        categoryName: 'SkillTemptation',
        icon: '30041',
        sets: ['30041', '30042'],
      },
      {
        categoryName: 'SkillHeal',
        icon: '30051',
        sets: ['30051', '30052'],
      },
      {
        categoryName: 'SkillSight',
        icon: '30071',
        sets: ['30071', '30072'],
      },
    ],
  },
];

const { TreeNode } = TreeSelect;
const skillData = skillJson as { [key: string]: SkillData };

interface IProps {
  localization: LocalizationData,
  setData: (key: string, value: any) => void,
  state: {
  },
}

interface IState {
}

class SkillSelector extends Component<IProps, IState> {
  private _skillSets: { [key: string]: SkillData[] } = {};

  constructor(props: IProps) {
    super(props);
    this.state = {
    };

    for (const [, skill] of Object.entries(skillData)) {
      if (!(skill.icon_id in this._skillSets)) {
        this._skillSets[skill.icon_id] = [];
      }

      if (skill.rarity === 1 || skill.rarity === 2) {
        this._skillSets[skill.icon_id].push(skill);
      }
    }
  }

  buildSkillTreeNodes(definitions: SkillSelectorDefinition[] | undefined, localization: LocalizationData): JSX.Element[] {
    if (!definitions) {
      return [];
    }

    return _.map(definitions, (definition) => {
      let title: any = localization.site[definition.categoryName];
      if ('icon' in definition) {
        title = (
          <span>
            <img
              className="skillIcon"
              src={`${process.env.PUBLIC_URL}/static/image/skill/${definition.icon}.png`}
              alt={title}
            />
            {title}
          </span>
        );
      }

      let children: JSX.Element[] = [];
      if ('children' in definition) {
        children = this.buildSkillTreeNodes(definition.children, localization);
      }

      let skills: JSX.Element[] = [];
      if ('sets' in definition) {
        skills = _
          .chain(definition.sets)
          .map((set) => this._skillSets[set])
          .filter((skillSet) => Array.isArray(skillSet))
          .flatten()
          .sortBy(['group_id', 'id'])
          .map((skill) => (
            <TreeNode
              key={skill.id}
              title={(
                <span className={`skill_${skill.rarity}`}>
                  <img
                    className="skillIcon"
                    src={`${process.env.PUBLIC_URL}/static/image/skill/${skill.icon_id}.png`}
                    alt={localization.site.Speed}
                  />
                  {skill.name}
                </span>
              )}
              value={skill.id}
            />
          ))
          .value();
      }

      return (
        <TreeNode
          key={definition.categoryName}
          title={title}
          value={0}
          disabled
        >
          {children}
          {skills}
        </TreeNode>
      );
    });
  }

  render() {
    const { localization, setData } = this.props;
    return (
      <Row gutter={[8, 8]}>
        <Col span={24}>
          <div className="flex">
            <span className="select-label">{`${localization.site.SkillSelector}:`}</span>
            <TreeSelect
              dropdownPopupAlign={{
                overflow: { adjustY: 0, adjustX: 0 },
                offset: [0, 2],
              }}
              treeLine
              allowClear
              multiple
              autoClearSearchValue
              showCheckedStrategy={TreeSelect.SHOW_PARENT}
              style={{
                width: '100%',
              }}
              onChange={(value) => setData('skills', value)}
            >
              { this.buildSkillTreeNodes(SKILL_SELECTOR_HIERARCHY, localization) }
            </TreeSelect>
          </div>
        </Col>
      </Row>
    );
  }
}

export default SkillSelector;
