import {
  DistanceType, ProperRate, GroundType, RunningStyle, SkillData,
} from '../common';

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

  skills: SkillData[];

  constructor(
    { stat, properRate, skills }: {
      stat: HorseStat,
      properRate: HorseProperRate,
      skills: SkillData[],
    },
  ) {
    this.stat = stat;
    this.properRate = properRate;
    this.skills = skills;
  }
}

export default Horse;
