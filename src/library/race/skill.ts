import {
  SkillConditionObject, SkillConditionObjectFormula, SkillConditionObjectLogical, SkillConditionOperatorsFormula,
} from '../common';
import { IRaceHorse } from './common';

class Skill {
  static matchBase(condition: SkillConditionObject, raceHorse: IRaceHorse): boolean {
    if (condition === {}) {
      return true;
    }

    const realCondition = condition as SkillConditionObjectLogical | SkillConditionObjectFormula;
    if (realCondition.operator === 'and') {
      const andCondition = realCondition as SkillConditionObjectLogical;
      for (const childCondition of andCondition.items) {
        if (!Skill.matchBase(childCondition, raceHorse)) {
          return false;
        }
      }
      return true;
    }

    if (realCondition.operator === 'or') {
      const orCondition = realCondition as SkillConditionObjectLogical;
      for (const childCondition of orCondition.items) {
        if (Skill.matchBase(childCondition, raceHorse)) {
          return true;
        }
      }
      return false;
    }

    const formulaCondition = realCondition as SkillConditionObjectFormula;
    const targetValue = Skill.getTargetValue(formulaCondition, raceHorse);
    if (typeof targetValue === 'boolean') {
      return targetValue;
    }

    switch (formulaCondition.operator) {
      case SkillConditionOperatorsFormula.GreaterThan:
        return targetValue > parseFloat(formulaCondition.value);
      case SkillConditionOperatorsFormula.GreaterThanOrEqualTo:
        return targetValue >= parseFloat(formulaCondition.value);
      case SkillConditionOperatorsFormula.LessThan:
        return targetValue < parseFloat(formulaCondition.value);
      case SkillConditionOperatorsFormula.LessThanOrEqualTo:
        return targetValue <= parseFloat(formulaCondition.value);
      case SkillConditionOperatorsFormula.EqualTo:
        return targetValue === formulaCondition.value;
      case SkillConditionOperatorsFormula.NotEqualTo:
        return targetValue !== formulaCondition.value;
      default:
        return false;
    }
  }

  static getTargetValue(condition: SkillConditionObjectFormula, raceHorse: IRaceHorse): string | number | boolean {
    switch (condition.key) {
      case 'rotation':
        return raceHorse.course.turnType;
      case 'track_id':
        return raceHorse.course.trackId;
      case 'is_basis_distance':
        return raceHorse.course.distance % 400 === 0 ? '1' : '0';
      case 'season':
        return raceHorse.season;
      case 'weather':
        return raceHorse.weather;
      case 'post_number':
        return raceHorse.postNumber;
      case 'running_style_count_same':
        return raceHorse.sameRunningStyleCount;
      case 'running_style_equal_popularity_one':
        return raceHorse.popularityFirstRunningStyle === raceHorse.runningStyle ? '1' : '0';
      case 'popularity':
        return raceHorse.popularity;
      case 'grade':
        // TODO
        return true;
      case 'running_style':
        return raceHorse.runningStyle;
      case 'random_lot':
        // Verification needed.
        return Math.random() * 100 <= parseFloat(condition.value);
      case 'same_skill_horse_count':
        // TODO
        return true;
      default:
        return true;
    }
  }
}

export default Skill;
