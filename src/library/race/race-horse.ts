import _ from 'lodash';
import constant, { CoursePhase, RunningStyle } from './constant';
import Course from './course';
import Horse, { HorseStat } from './horse';

import distanceProperRateJson from '../../db/proper_rate/distance.json';
import groundProperRateJson from '../../db/proper_rate/ground.json';
import runningStyleProperRateJson from '../../db/proper_rate/running_style.json';

const distanceProperRate = distanceProperRateJson as { [key: string]: { speed: number, power: number } };
const groundProperRate = groundProperRateJson as { [key: string]: number };
const runningStyleProperRate = runningStyleProperRateJson as { [key: string]: number };

enum BreakPoint {
  FinishFirstBlock = '0',
  FinishPhaseStart = '10',
  FinishPhaseMiddle = '20',
  FinishPhaseEnd = '30',
  FinishPhaseLastSpurt = '40',

  LastSpurt = '100',
  PositionSense = '110',
  Skill = '120',

  FinishBlock = '900',

  None = '9999',
}

enum Mode {
  StartDash,
  FirstBlock,
  LastSpurt,
  UpSlope,
  DownSlopeAccel,
  Temptation,
  PositionKeepPaceDown,
  ZeroHp,
}

class RaceHorse {
  private _course: Course;

  private _horse: Horse;

  private _runningStyle: RunningStyle;

  private _speedRandomRange: [number, number] = [0, 0];

  private _phase: CoursePhase = CoursePhase.Start;

  private _mode: Set<Mode> = new Set<Mode>();

  private _speed: number = 0;

  private _hp: number = 0;

  private _distance: number = 0;

  private _time: number = 0;

  private _breakPoints: { [key in BreakPoint]?: { distance?: number, time?: number } } = {};

  _startDashTargetSpeed: number | undefined = undefined;

  constructor({ horse, runningStyle, course }: {
    horse: Horse,
    runningStyle: RunningStyle,
    course: Course,
  }) {
    this._horse = horse;
    this._course = course;
    this._runningStyle = runningStyle;
    this.refreshSpeedRandomValue();
  }

  private get stat(): HorseStat {
    return {
      speed: this._horse.stat.speed,
      stamina: this._horse.stat.stamina,
      pow: this._horse.stat.pow,
      guts: this._horse.stat.guts,
      wiz: this._horse.stat.wiz,
    };
  }

  private get minSpeed(): number {
    return this._course.baseTargetSpeed * constant.minSpeed.minSpeedRate
      + Math.sqrt(this.stat.guts * constant.minSpeed.minSpeedGutsCoefSqrt) * constant.minSpeed.minSpeedGutsCoef;
  }

  private get startDashTargetSpeed(): number {
    if (this._startDashTargetSpeed === undefined) {
      this._startDashTargetSpeed = Math.max(this._course.baseTargetSpeed * constant.startDash.targetSpeedCoefficient, this.minSpeed);
    }
    return this._startDashTargetSpeed;
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
        * constant.targetSpeed.addSpeedParamCoef * distanceProperRate[this._horse.properRate.distanceType[this._course.distanceType]].speed;
  }

  private get lastSpurtTargetSpeed(): number {
    return Math.max(
      (this.phaseEndBaseTargetSpeed() + constant.targetSpeed.lastSpurtBaseTargetSpeedAddCoef * this._course.baseTargetSpeed)
          * constant.targetSpeed.baseTargetSpeedCoef
        + Math.sqrt(constant.targetSpeed.lastSpurtTargetSpeedCoefSqrt * this.stat.speed)
          * constant.targetSpeed.addSpeedParamCoef * distanceProperRate[this._horse.properRate.distanceType[this._course.distanceType]].speed,
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
      * groundProperRate[this._horse.properRate.groundType[this._course.groundType]]
      * distanceProperRate[this._horse.properRate.distanceType[this._course.distanceType]].power;
  }

  private phaseMiddleAccel(): number {
    return constant.accel.accelPhaseCoef[this._runningStyle][CoursePhase.Middle] * Math.sqrt(this.stat.pow * constant.accel.accelPowCoefSqrt)
      * groundProperRate[this._horse.properRate.groundType[this._course.groundType]]
      * distanceProperRate[this._horse.properRate.distanceType[this._course.distanceType]].power;
  }

  private phaseEndAccel(): number {
    return constant.accel.accelPhaseCoef[this._runningStyle][CoursePhase.End] * Math.sqrt(this.stat.pow * constant.accel.accelPowCoefSqrt)
      * groundProperRate[this._horse.properRate.groundType[this._course.groundType]]
      * distanceProperRate[this._horse.properRate.distanceType[this._course.distanceType]].power;
  }

  private readonly accelMap: { [key in CoursePhase]: () => number } = {
    [CoursePhase.Start]: this.phaseStartAccel,
    [CoursePhase.Middle]: this.phaseMiddleAccel,
    [CoursePhase.End]: this.phaseEndAccel,
    [CoursePhase.LastSpurt]: this.phaseEndAccel,
  };

  private get baseTargetSpeed(): number {
    if (Mode.StartDash in this._mode || Mode.FirstBlock in this._mode) {
      return this.startDashTargetSpeed;
    }
    if (Mode.LastSpurt in this._mode) {
      return this.lastSpurtTargetSpeed;
    }
    return this.baseTargetSpeedMap[this._phase]();
  }

  private get realTargetSpeed(): number {
    const slopePer = this._course.getSlopePer(this._distance);
    let slopeAdd = 0;
    if (slopePer >= 1) {
      slopeAdd = slopePer * constant.targetSpeed.upSlopeAddSpeedVal1 / this.stat.pow;
    } else if (slopePer <= -1 && Mode.DownSlopeAccel in this._mode) {
      slopeAdd = constant.targetSpeed.downSlopeAddSpeedVal1 + Math.abs(slopePer) / constant.targetSpeed.downSlopeAddSpeedVal2;
    }
    return this.baseTargetSpeed * (Mode.LastSpurt in this._mode ? 1 : _.random(...this._speedRandomRange, true)) + slopeAdd;
  }

  get maxHp(): number {
    return this._course.distance + this.stat.stamina * constant.hp.hpMaxCoef[this._runningStyle] * constant.hp.hpInitialVal1;
  }

  get targetSpeed(): number {
    return Math.max(this.minSpeed, this.realTargetSpeed);
  }

  refreshSpeedRandomValue(): void {
    const upperBound = (this.stat.wiz / constant.targetSpeed.baseTargetSpeedRandomPlusVal1)
      * Math.log10(this.stat.wiz * constant.targetSpeed.baseTargetSpeedRandomLogCoefficient);
    const lowerBound = constant.targetSpeed.baseTargetSpeedRandomMinusVal1
      + (this.stat.wiz / constant.targetSpeed.baseTargetSpeedRandomPlusVal1)
        * Math.log10(this.stat.wiz * constant.targetSpeed.baseTargetSpeedRandomLogCoefficient);
    this._speedRandomRange = [lowerBound, upperBound];
  }

  get accel(): number {
    if (Mode.ZeroHp in this._mode) {
      return constant.accel.accelDecreaseZeroHpCoef;
    }

    const { targetSpeed } = this;
    if (this._speed < this.targetSpeed) {
      return (Mode.StartDash in this._mode ? constant.accel.startAccelAdd : 0)
        + this.accelMap[this._phase]() * (Mode.UpSlope in this._mode ? constant.accel.accelPowCoefUpSlope : constant.accel.accelPowCoef);
    }
    if (this._speed > targetSpeed) {
      return constant.accel.accelDecreaseCoef[this._phase];
    }
    return 0;
  }

  private get phaseEndHpDecreaseRate() {
    return constant.hp.hpGutsBase + constant.hp.hpGutsCoef / Math.sqrt(constant.hp.hpGutsCoefSqrt * this.stat.guts);
  }

  private get modeHpDecreaseRate() {
    if (Mode.Temptation in this._mode) {
      return constant.hp.hpDecRateBaseTemptation;
    }
    if (Mode.PositionKeepPaceDown in this._mode) {
      return constant.hp.hpDecRateBasePositionKeepPaseDown;
    }
    return constant.hp.hpDecRateBaseNormal;
  }

  getHpDecreaseRate(phase: CoursePhase) {
    return constant.hp.hpDecBase * constant.hp.groundModifierMultiHpSub[this._course.groundType][this._course.groundStatus]
      * (phase >= CoursePhase.End ? this.phaseEndHpDecreaseRate : 1)
      * this.modeHpDecreaseRate
      * (Mode.DownSlopeAccel in this._mode ? constant.hp.hpDecRateMultiplyDownSlopeAccelMode : 1);
  }

  get minBreakpoint(): { breakPoint: BreakPoint, distance: number } {
    let minKey: BreakPoint = BreakPoint.None;
    let minDistance: number = Number.MAX_VALUE;
    for (const [key, value] of Object.entries(this._breakPoints)) {
      if (value.distance !== undefined) {
        if (value.distance < minDistance) {
          minDistance = value.distance;
          minKey = key as BreakPoint;
        } else if (value.distance === minDistance && minKey < key) {
          minKey = key as BreakPoint;
        }
      } else if (value.time !== undefined) {
        const distance = this._distance + (value.time - this._time) * this._speed;
        if (distance < minDistance) {
          minDistance = distance;
          minKey = key as BreakPoint;
        } else if (value.distance === minDistance && minKey < key) {
          minKey = key as BreakPoint;
        }
      }
    }
    return { breakPoint: minKey, distance: minDistance };
  }

  private getAccelHpDecrease(initialSpeed: number, accel: number, time: number): number {
    const speedCoefficient = (initialSpeed - this._course.baseTargetSpeed + constant.hp.speedGapParam1);
    return this.getHpDecreaseRate(this._phase)
      * (accel ** 2 * time ** 3 / 3 + accel * time ** 2 * speedCoefficient + speedCoefficient ** 2 * time)
      / constant.hp.speedGapParam1Pow;
  }

  private getRunHpDecrease(speed: number, time: number): number {
    return this.getHpDecreaseRate(this._phase) * (speed - this._course.baseTargetSpeed + constant.hp.speedGapParam1) ** 2 / constant.hp.speedGapParam1Pow;
  }

  private doGateOpen() {
    this._time += Math.ceil(_.random(constant.course.gateTimeRange.min, constant.course.gateTimeRange.max, true) / constant.course.frameTime)
      * constant.course.frameTime;
  }

  private finishStartDash(): void {
    const { accel } = this;
    const time = (this.startDashTargetSpeed - this._speed) / accel;
    this._time += time;
    this._distance += (this._speed + this.startDashTargetSpeed) * time / 2;
    this._hp -= this.getAccelHpDecrease(this._speed, accel, time);

    this._speed = this.startDashTargetSpeed;
    this._mode.delete(Mode.StartDash);
    if (this._runningStyle === RunningStyle.Sashi || this._runningStyle === RunningStyle.Oikomi) {
      this._breakPoints[BreakPoint.FinishFirstBlock] = { distance: this._course.blockDistance };
      this._mode.add(Mode.FirstBlock);
    } else {
      this._breakPoints[BreakPoint.FinishPhaseStart] = { distance: this._course.phaseStartDistance };
    }
  }

  private doAccelAndRun(distance: number) {
    const { accel, targetSpeed } = this;
    const accelDistance = distance - this._distance;
    const realTargetSpeed = accel > 0
      ? Math.min(targetSpeed, Math.sqrt(this._speed ** 2 + 2 * accel * accelDistance))
      : Math.max(targetSpeed, Math.sqrt(Math.max(this._speed ** 2 + 2 * accel * accelDistance, 0)));
    const accelTime = (realTargetSpeed - targetSpeed) / accel;
    this._time += accelTime;
    this._distance += (this._speed + this._speed + accel * accelTime) * accelTime / 2;
    this._hp -= this.getAccelHpDecrease(this._speed, accel, accelTime);

    this._speed = realTargetSpeed;
    const runTime = (distance - this._distance) / this._speed;
    this._time += runTime;
    this._distance = distance;
    this._hp -= this.getRunHpDecrease(this._speed, runTime);
  }

  private finishFirstBlock(): void {
    this._mode.delete(Mode.FirstBlock);
    this._breakPoints[BreakPoint.FinishPhaseStart] = { distance: this._course.phaseStartDistance };
  }

  private finishBlock(): void {
    this._mode.delete(Mode.FirstBlock);
    this._breakPoints[BreakPoint.FinishPhaseStart] = { distance: this._course.phaseStartDistance };
  }

  private finishPhaseStart(): void {
    this._phase = CoursePhase.Middle;
    this._breakPoints[BreakPoint.FinishPhaseMiddle] = { distance: this._course.phaseMiddleDistance };
  }

  private finishPhaseMiddle(): void {
    this._phase = CoursePhase.End;
    this._breakPoints[BreakPoint.FinishPhaseMiddle] = { distance: this._course.phaseMiddleDistance };
  }

  private finishPhaseEnd(): void {
    this._phase = CoursePhase.LastSpurt;
    this._breakPoints[BreakPoint.FinishPhaseLastSpurt] = { distance: this._course.distance };
  }

  private doLastSpurt(): void {
    delete this._breakPoints[BreakPoint.LastSpurt];
    this._mode.add(Mode.LastSpurt);
  }

  private finishLastSpurt = () => {};

  private triggerPositionSense = () => {};

  private triggerSkill = () => {};

  private readonly breakPointMap: { [key in BreakPoint]: () => void } = {
    [BreakPoint.None]: () => {},
    [BreakPoint.FinishFirstBlock]: this.finishFirstBlock,
    [BreakPoint.FinishBlock]: this.finishBlock,
    [BreakPoint.FinishPhaseStart]: this.finishPhaseStart,
    [BreakPoint.FinishPhaseMiddle]: this.finishPhaseMiddle,
    [BreakPoint.FinishPhaseEnd]: this.finishPhaseEnd,
    [BreakPoint.LastSpurt]: this.doLastSpurt,
    [BreakPoint.FinishPhaseLastSpurt]: this.finishLastSpurt,
    [BreakPoint.PositionSense]: this.triggerPositionSense,
    [BreakPoint.Skill]: this.triggerSkill,
  };

  simulate() {
    this._speed = constant.course.startSpeed;
    this._time = 0;
    this._distance = 0;
    this._hp = this.maxHp;
    this._mode.add(Mode.StartDash);
    this._phase = CoursePhase.Start;

    this.doGateOpen();
    this.finishStartDash();

    while (Object.keys(this._breakPoints).length > 0) {
      const { breakPoint, distance } = this.minBreakpoint;
      this.doAccelAndRun(distance);
      delete this._breakPoints[breakPoint];
      this.breakPointMap[breakPoint]();
    }
  }
}

export default RaceHorse;
