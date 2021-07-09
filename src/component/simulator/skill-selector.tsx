import _ from 'lodash';
import React, { Component } from 'react';
import TreeSelect from 'rc-tree-select';

import { LocalizationData, SkillData } from '../../library/common';

import 'rc-tree-select/assets/index.less';

import skillJson from '../../db/skill.json';

const skills = skillJson as SkillData[];

interface IProps {
  localization: LocalizationData,
  setData: (key: string, value: any) => void,
  state: {
  },
}

interface IState {
}

class SkillSelector extends Component<IProps, IState> {
  private _skillSelectData: { key: string, label: string, value: string, disabled: boolean }[];

  constructor(props: IProps) {
    super(props);
    this.state = {
    };

    this._skillSelectData = _.map(skills, (skill) => ({
      key: skill.id,
      label: skill.name,
      value: skill.id,
      disabled: false,
    }));
  }

  render() {
    return (
      <TreeSelect
        className="check-select"
        dropdownPopupAlign={{
          overflow: { adjustY: 0, adjustX: 0 },
          offset: [0, 2],
        }}
        treeLine
        autoClearSearchValue
        treeData={this._skillSelectData}
        showCheckedStrategy={TreeSelect.SHOW_PARENT}
      />
    );
  }
}

export default SkillSelector;
