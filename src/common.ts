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
  Middle,
  End,
  LastSpurt,
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
    corner: { start: number, end: number }[],
    straight: { start: number, end: number }[],
  }
  slope_per: { distance: number, slope_per: number }[],
}

class Common {
}

export default Common;
