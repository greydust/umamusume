import {
  RunningStyle, ProperRate, DistanceType, GroundType,
} from './constant';

export interface HorseStat {
  speed: number;
  stamina: number;
  pow: number;
  guts: number;
  wiz: number;
}

export interface HorseProperRate {
  distanceType: { [key in DistanceType]: ProperRate },
  groundType: { [key in GroundType]: ProperRate },
  runningStyle: { [key in RunningStyle]: ProperRate },
}

class Horse {
  stat: HorseStat;

  properRate: HorseProperRate;

  constructor(
    { stat, properRate }: {
      stat: HorseStat,
      properRate: HorseProperRate,
    },
  ) {
    this.stat = stat;
    this.properRate = properRate;
  }
}

export default Horse;