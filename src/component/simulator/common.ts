import { ProperRate } from '../../common';

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

class Common {
}

export default Common;
