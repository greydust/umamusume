import _ from 'lodash';

import constant, { CoursePhase, RunningStyle } from './constant';
import Course from './course';

interface CharacterStat {
  speed: number;
  stamina: number;
  pow: number;
  guts: number;
  wiz: number;
}

class Character {
  private _stat: CharacterStat;

  private _style: RunningStyle;

  private _course: Course;

  private _speedRandomRange: [number, number] = [0, 0];

  constructor(
    { stat, style, course }: {
      stat: CharacterStat,
      style: RunningStyle,
      course: Course,
    },
  ) {
    this._stat = stat;
    this._style = style;
    this._course = course;

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
    return this._course.baseTargetSpeed * constant.startDash.targetSpeedCoefficient;
  }

  get phaseStartBaseTargetSpeed(): number {
    return this._course.baseTargetSpeed * constant.targetSpeed.targetSpeedCoefficient[this._style][CoursePhase.Start];
  }

  get phaseStartTargetSpeed(): number {
    return this.phaseStartBaseTargetSpeed * _.random(...this._speedRandomRange, true);
  }

  get phaseMiddleBaseTargetSpeed(): number {
    return this._course.baseTargetSpeed * constant.targetSpeed.targetSpeedCoefficient[this._style][CoursePhase.Middle];
  }

  get phaseMiddleTargetSpeed(): number {
    return this.phaseMiddleBaseTargetSpeed * _.random(...this._speedRandomRange, true);
  }

  get phaseEndBaseTargetSpeed(): number {
    return this._course.baseTargetSpeed * constant.targetSpeed.targetSpeedCoefficient[this._style][CoursePhase.End]
      + Math.sqrt(constant.targetSpeed.phaseEndBaseTargetSpeedCoef * this.stat.speed) * constant.targetSpeed.addSpeedParamCoef;
  }

  get phaseEndTargetSpeed(): number {
    return this.phaseEndBaseTargetSpeed * _.random(...this._speedRandomRange, true);
  }

  get lastSpurtTargetSpeed(): number {
    return (this.phaseEndBaseTargetSpeed + constant.targetSpeed.lastSpurtBaseTargetSpeedAddCoef * this._course.baseTargetSpeed)
        * constant.targetSpeed.baseTargetSpeedCoef
      + Math.sqrt(constant.targetSpeed.lastSpurtTargetSpeedCoefSqrt * this.stat.speed) * constant.targetSpeed.addSpeedParamCoef;
  }
}

export default Character;