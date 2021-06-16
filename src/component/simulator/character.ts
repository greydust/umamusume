import _ from 'lodash';

import constant, { CoursePhase, RunningStyle, ProperRate } from './constant';
import Course from './course';

import distanceProperRateJson from '../../db/proper_rate/distance.json';
import groundProperRateJson from '../../db/proper_rate/ground.json';
import runningStyleProperRateJson from '../../db/proper_rate/running_style.json';

const distanceProperRate = distanceProperRateJson as { [key: string]: { speed: number, power: number } };
const groundProperRate = groundProperRateJson as { [key: string]: number };
const runningStyleProperRate = runningStyleProperRateJson as { [key: string]: number };

interface CharacterStat {
  speed: number;
  stamina: number;
  pow: number;
  guts: number;
  wiz: number;
}

class Character {
  private _stat: CharacterStat;

  private _runningStyle: RunningStyle;

  private _course: Course;

  private _speedRandomRange: [number, number] = [0, 0];

  private _properRate: { distance: ProperRate, ground: ProperRate, runningStyle: ProperRate };

  private _downSlopeAccelMode: boolean;

  constructor(
    {
      stat, runningStyle, course, properRate,
    }: {
      stat: CharacterStat,
      runningStyle: RunningStyle,
      course: Course,
      properRate: { distance: ProperRate, ground: ProperRate, runningStyle: ProperRate },
    },
  ) {
    this._stat = stat;
    this._runningStyle = runningStyle;
    this._course = course;
    this._properRate = properRate;
    this._downSlopeAccelMode = false;

    this.refreshSpeedRandomRange();
  }

  get stat(): CharacterStat {
    return {
      speed: this._stat.speed,
      stamina: this._stat.stamina,
      pow: this._stat.pow,
      guts: this._stat.guts,
      wiz: this._stat.wiz,
    };
  }

  refreshSpeedRandomRange() {
    const upperBound = (this.stat.wiz / constant.targetSpeed.baseTargetSpeedRandomPlusVal1)
      * Math.log10(this.stat.wiz * constant.targetSpeed.baseTargetSpeedRandomLogCoefficient);
    const lowerBound = constant.targetSpeed.baseTargetSpeedRandomMinusVal1
      + (this.stat.wiz / constant.targetSpeed.baseTargetSpeedRandomPlusVal1)
        * Math.log10(this.stat.wiz * constant.targetSpeed.baseTargetSpeedRandomLogCoefficient);
    this._speedRandomRange = [lowerBound, upperBound];
  }

  get minSpeed(): number {
    return this._course.baseTargetSpeed * constant.minSpeed.minSpeedRate
      + Math.sqrt(this.stat.guts * constant.minSpeed.minSpeedGutsCoefSqrt) * constant.minSpeed.minSpeedGutsCoef;
  }

  get startDashTargetSpeed(): number {
    return Math.max(this._course.baseTargetSpeed * constant.startDash.targetSpeedCoefficient, this.minSpeed);
  }

  private phaseStartBaseTargetSpeed(): number {
    return this._course.baseTargetSpeed * constant.targetSpeed.targetSpeedCoefficient[this._runningStyle][CoursePhase.Start];
  }

  private phaseMiddleBaseTargetSpeed(): number {
    return this._course.baseTargetSpeed * constant.targetSpeed.targetSpeedCoefficient[this._runningStyle][CoursePhase.Middle];
  }

  private phaseEndBaseTargetSpeed(): number {
    return this._course.baseTargetSpeed * constant.targetSpeed.targetSpeedCoefficient[this._runningStyle][CoursePhase.End]
      + Math.sqrt(constant.targetSpeed.phaseEndBaseTargetSpeedCoef * this.stat.speed)
        * constant.targetSpeed.addSpeedParamCoef * distanceProperRate[this._properRate.distance].speed;
  }

  private get lastSpurtTargetSpeed(): number {
    return Math.max(
      (this.phaseEndBaseTargetSpeed() + constant.targetSpeed.lastSpurtBaseTargetSpeedAddCoef * this._course.baseTargetSpeed)
          * constant.targetSpeed.baseTargetSpeedCoef
        + Math.sqrt(constant.targetSpeed.lastSpurtTargetSpeedCoefSqrt * this.stat.speed)
          * constant.targetSpeed.addSpeedParamCoef * distanceProperRate[this._properRate.distance].speed,
      this.minSpeed,
    );
  }

  private readonly baseTargetSpeedMap: { [key in CoursePhase]: () => number } = {
    [CoursePhase.Start]: this.phaseStartBaseTargetSpeed,
    [CoursePhase.Middle]: this.phaseMiddleBaseTargetSpeed,
    [CoursePhase.End]: this.phaseEndBaseTargetSpeed,
    [CoursePhase.LastSpurt]: this.phaseEndBaseTargetSpeed,
  };

  private phaseStartAccel(): number {
    return constant.accel.accelPhaseCoef[this._runningStyle][CoursePhase.Start] * Math.sqrt(this.stat.pow * constant.accel.accelPowCoefSqrt)
      * groundProperRate[this._properRate.ground] * distanceProperRate[this._properRate.distance].power;
  }

  private phaseMiddleAccel(): number {
    return constant.accel.accelPhaseCoef[this._runningStyle][CoursePhase.Middle] * Math.sqrt(this.stat.pow * constant.accel.accelPowCoefSqrt)
      * groundProperRate[this._properRate.ground] * distanceProperRate[this._properRate.distance].power;
  }

  private phaseEndAccel(): number {
    return constant.accel.accelPhaseCoef[this._runningStyle][CoursePhase.End] * Math.sqrt(this.stat.pow * constant.accel.accelPowCoefSqrt)
      * groundProperRate[this._properRate.ground] * distanceProperRate[this._properRate.distance].power;
  }

  private readonly accelMap: { [key in CoursePhase]: () => number } = {
    [CoursePhase.Start]: this.phaseStartAccel,
    [CoursePhase.Middle]: this.phaseMiddleAccel,
    [CoursePhase.End]: this.phaseEndAccel,
    [CoursePhase.LastSpurt]: this.phaseEndAccel,
  };

  private getBaseTargetSpeed(
    {
      startDash, firstBlock, phase, lastSpurt,
    }: {
      startDash: boolean, firstBlock: boolean, phase: CoursePhase, lastSpurt: boolean,
    },
  ): number {
    if (startDash || (firstBlock && this._runningStyle in constant.targetSpeed.firstBlockSlowStyles)) {
      return this.startDashTargetSpeed;
    }
    if (lastSpurt) {
      return this.lastSpurtTargetSpeed;
    }
    return this.baseTargetSpeedMap[phase]();
  }

  private getRealTargetSpeed(
    options: {
      startDash: boolean, firstBlock: boolean, phase: CoursePhase, lastSpurt: boolean, slopePer: number,
    },
  ): number {
    const { lastSpurt, slopePer } = options;
    let slopeAdd = 0;
    if (slopePer >= 1) {
      slopeAdd = slopePer * constant.targetSpeed.upSlopeAddSpeedVal1 / this.stat.pow;
    } else if (slopePer <= -1 && this._downSlopeAccelMode) {
      slopeAdd = constant.targetSpeed.downSlopeAddSpeedVal1 + Math.abs(slopePer) / constant.targetSpeed.downSlopeAddSpeedVal2;
    }
    return this.getBaseTargetSpeed(options) * (lastSpurt ? 1 : _.random(...this._speedRandomRange, true)) + slopeAdd;
  }

  getTargetSpeed(
    options: {
      startDash: boolean, firstBlock: boolean, phase: CoursePhase, lastSpurt: boolean, slopePer: number,
    },
  ): number {
    return Math.max(this.minSpeed, this.getRealTargetSpeed(options));
  }

  getAccel(startDash: boolean, upSlope: boolean, phase: CoursePhase) {
    return (startDash ? constant.accel.startAccelAdd : 0)
      + this.accelMap[phase]() * (upSlope ? constant.accel.accelPowCoefUpSlope : constant.accel.accelPowCoef);
  }
}

export default Character;
