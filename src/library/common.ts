/* eslint-disable @typescript-eslint/no-shadow */
export interface LocalizationData {
  character: {
    name: LocalizationMap,
  },
  course: {
    racecourse: LocalizationMap,
    ground: LocalizationMap,
    inout: LocalizationMap,
  },
  site: LocalizationMap,
  [key: string]: string | LocalizationSubData,
}

export interface LocalizationSubData {
  [key: string]: string | LocalizationSubData,
}

interface LocalizationMap {
  [key: string]: string,
}

export enum RunningStyle {
  Nige = 'RunningStyleNige',
  Senko = 'RunningStyleSenko',
  Sashi = 'RunningStyleSashi',
  Oikomi = 'RunningStyleOikomi',
}

export enum DistanceType {
  Short = 'DistanceTypeShort',
  Mile = 'DistanceTypeMile',
  Middle = 'DistanceTypeMiddle',
  Long = 'DistanceTypeLong',
}

export enum GroundType {
  Turf = '1',
  Dirt = '2',
}

export enum TurnType {
  Right = '1',
  Left = '2',
  Straight = '4',
}

export enum InoutType {
  Normal = '1',
  Inner = '2',
  Outer = '3',
  OuterInner = '4',
}

export enum CoursePhase {
  Start = 0,
  Middle = 1,
  End = 2,
  LastSpurt = 3,
}

export enum GroundStatus {
  Good = 'GroundStatusGood',
  SlightlyHeavy = 'GroundStatusSlightlyHeavy',
  Heavy = 'GroundStatusHeavy',
  Bad = 'GroundStatusBad',
}

export enum ProperRate {
  G = '1',
  F = '2',
  E = '3',
  D = '4',
  C = '5',
  B = '6',
  A = '7',
  S = '8',
}

export interface CourseCategory {
  [key: string]: {
    [key: string]: {
      [key: string]: CourseDataType,
    },
  },
}

export interface CourseDataType {
  id: string,
  race_track_id: string,
  distance: number,
  ground: GroundType,
  turn: TurnType,
  inout: InoutType,
  course_set_status_id: string,
  finish_time_min: string,
  finish_time_min_random_range: string,
  finish_time_max: string,
  finish_time_max_random_range: string,
  param: {
    corner: { start?: number, end?: number }[],
    straight: { start: number, end: number }[],
    corner_index: number[],
  },
  slope_per: { distance: number, slope_per: number }[],
}

export interface SkillData {
  id: string,
  name: string,
  rarity: number,
  description: string,
  icon_id: string,
  need_skill_point: number | null,
  abilities: SkillAbilityData[],
}

export interface SkillAbilityData {
  condition_raw: string,
  condition: SkillConditionObject,
  ability_time: number,
  cooldown_time: number,
  effects: SkillEffectData[],
}

export interface SkillEffectData {
  ability_type: SkillAbilityType,
  ability_value: number,
  target_type: SkillAbilityTargetType,
  target_value: number,
}

export enum SkillAbilityType {
  AddSpeed = '1',
  AddStamina = '2',
  AddPow = '3',
  AddGuts = '4',
  AddWiz = '5',
  AddSight = '8',
  AddHp = '9',
  ExtendTemptation = '13',
  AddTargetSpeed = '27',
  AddLaneAccel = '28',
  AddAccel = '31',
}

export enum SkillAbilityTargetType {
  Self = '1',
  FrontInSight = '4',
  FrontAll = '9',
  BehindAll = '10',
  RunningStyle = '18',
  DistanceFront = '19',
  DistanceBehind = '20',
  RunningStyleInTemptation = '21',
}

enum SkillConditionOperatorsLogical {
  And = 'and',
  Or = 'or',
}

export enum SkillConditionOperatorsFormula {
  GreaterThan = '>',
  GreaterThanOrEqualTo = '>=',
  LessThan = '<',
  LessThanOrEqualTo = '<=',
  EqualTo = '==',
  NotEqualTo = '!=',
}

export interface SkillConditionObjectLogical {
  operator: SkillConditionOperatorsLogical,
  items: SkillConditionObject[],
}

export interface SkillConditionObjectFormula {
  operator: SkillConditionOperatorsFormula,
  key: string,
  value: string,
}

export type SkillConditionObject = SkillConditionObjectLogical | SkillConditionObjectFormula | {};

class Common {
  static secondToTime(time: number): string {
    const hour = Math.floor(time / 3600);
    const hourString = hour > 0 ? `${hour}:` : '';
    const minute = Math.floor((time - hour * 3600) / 60);
    const minuteString = minute > 0
      ? `${hour > 0 ? `${minute.toString().padStart(2, '0')}` : minute}:`
      : '';
    const second = Math.floor(time - hour * 3600 - minute * 60);
    const secondString = second > 0
      ? `${(hour > 0 || minute > 0) ? `${second.toString().padStart(2, '0')}` : second}`
      : '0';
    const minorString = `.${Math.floor((time - hour * 3600 - minute * 60 - second) * 1000).toString().padStart(3, '0')}`;
    return `${hourString}${minuteString}${secondString}${minorString}`;
  }
}

export default Common;
