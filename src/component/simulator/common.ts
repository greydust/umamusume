import { ProperRate } from '../../library/common';
import { ResultFlag } from '../../library/race/common';

export interface IHorseState {
  speed: number,
  stamina: number,
  pow: number,
  guts: number,
  wiz: number,
}

export interface IGroundProperRate {
  groundTypeTurf: ProperRate,
  groundTypeDirt: ProperRate,
}

export interface IDistanceProperRate {
  distanceTypeShort: ProperRate,
  distanceTypeMile: ProperRate,
  distanceTypeMiddle: ProperRate,
  distanceTypeLong: ProperRate,
}

export interface IRunningStyleProperRate {
  runningStyleNige: ProperRate,
  runningStyleSenko: ProperRate,
  runningStyleSashi: ProperRate,
  runningStyleOikomi: ProperRate,
}

export interface RaceResultData {
  time: number,
  resultFlags: Set<ResultFlag>,
  hpLeft: number,
  skills: {
    normal: number,
    rare: number,
    unique: boolean,
  },
  temptation: {
    triggered: boolean,
    time: number,
  },
}

class Common {
}

export default Common;
