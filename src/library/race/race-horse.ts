import _ from 'lodash';
import nr from 'newton-raphson-method';
import util from 'util';

import constant from './constant';
import Course from './course';
import Horse, { HorseStat } from './horse';

import distanceProperRateJson from '../../db/proper_rate/distance.json';
import groundProperRateJson from '../../db/proper_rate/ground.json';
import runningStyleProperRateJson from '../../db/proper_rate/running_style.json';
import { ResultFlag } from './common';
import { RunningStyle, CoursePhase } from '../../common';

const distanceProperRate = distanceProperRateJson as { [key: string]: { speed: number, power: number } };
const groundProperRate = groundProperRateJson as { [key: string]: number };
const runningStyleProperRate = runningStyleProperRateJson as { [key: string]: number };

enum BreakPoint {
  Goal = '0000',

  FinishFirstBlock = '1000',
  FinishPhaseStart = '1010',
  FinishPhaseMiddle = '1020',
  FinishPhaseEnd = '1030',
  FinishPhaseLastSpurt = '1040',

  LastSpurt = '2000',
  PositionSense = '2010',
  Skill = '2020',
  DownSlopeAccelMode = '2030',
  ZeroHp = '2040',

  FinishBlock = '3000',
  Slope = '3010',

  None = '9999',
}

interface BreakPointData {
  distance?: number,
  time?: number,
  parameters?: any
}

interface BreakPointSet {
  [BreakPoint.FinishFirstBlock]?: BreakPointData,
  [BreakPoint.FinishPhaseStart]?: BreakPointData,
  [BreakPoint.FinishPhaseMiddle]?: BreakPointData,
  [BreakPoint.FinishPhaseEnd]?: BreakPointData,
  [BreakPoint.FinishPhaseLastSpurt]?: BreakPointData,

  [BreakPoint.LastSpurt]?: BreakPointData,
  [BreakPoint.PositionSense]?: BreakPointData,
  [BreakPoint.Skill]?: BreakPointData[],
  [BreakPoint.DownSlopeAccelMode]?: BreakPointData,
  [BreakPoint.ZeroHp]?: BreakPointData,

  [BreakPoint.FinishBlock]?: BreakPointData,
  [BreakPoint.Slope]?: BreakPointData[],

  [BreakPoint.Goal]?: BreakPointData,

  [BreakPoint.None]?: BreakPointData,
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

interface LastSpurtCandidate {
  time: number,
  targetSpeed: number,
  lastSpurtDistance: number,
}

class RaceHorse {
  private _course: Course;

  private _horse: Horse;

  private _runningStyle: RunningStyle;

  private _speedWizRandomRange: [number, number] = [0, 0];

  private _speedWizRandom: number = 0;

  private _phase: CoursePhase = CoursePhase.Start;

  private _mode: Set<Mode> = new Set<Mode>();

  private _speed: number = 0;

  private _lastSpurtTargetSpeed: number = 0;

  private _hp: number = 0;

  private _distance: number = 0;

  private _time: number = 0;

  private _breakPoints: BreakPointSet = {};

  private _startDashTargetSpeed: number | undefined = undefined;

  private _slopePer: number = 0;

  resultFlag: Set<ResultFlag> = new Set<ResultFlag>();

  constructor({ horse, runningStyle, course }: {
    horse: Horse,
    runningStyle: RunningStyle,
    course: Course,
  }) {
    this._horse = horse;
    this._course = course;
    this._runningStyle = runningStyle;

    const upperBound = (this.stat.wiz / constant.targetSpeed.baseTargetSpeedRandomPlusVal1) * constant.targetSpeed.baseTargetSpeedRandomCoefficient
      * Math.log10(this.stat.wiz * constant.targetSpeed.baseTargetSpeedRandomLogCoefficient);
    const lowerBound = constant.targetSpeed.baseTargetSpeedRandomMinusVal1
      + (this.stat.wiz / constant.targetSpeed.baseTargetSpeedRandomPlusVal1) * constant.targetSpeed.baseTargetSpeedRandomCoefficient
      * Math.log10(this.stat.wiz * constant.targetSpeed.baseTargetSpeedRandomLogCoefficient);
    this._speedWizRandomRange = [lowerBound, upperBound];
    this.refreshSpeedRandomValue();
  }

  get maxHp(): number {
    return this._course.distance + this.stat.stamina * constant.hp.hpMaxCoef[this._runningStyle] * constant.hp.hpInitialVal1;
  }

  get hp(): number {
    return this._hp;
  }

  get time(): number {
    return this._time;
  }

  private get lastSpurtDetermineRate(): number {
    return constant.lastSpurt.determineRateBase + constant.lastSpurt.determineRateWizMultiplier * this.stat.wiz;
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

  private get baseTargetSpeed(): number {
    return this._course.baseTargetSpeed * constant.targetSpeed.targetSpeedCoefficient[this._runningStyle][this._phase];
  }

  private get baseTargetSpeedRandom(): number {
    return this.baseTargetSpeed * this._speedWizRandom;
  }

  private get phaseEndTargetSpeedAddition(): number {
    return Math.sqrt(constant.targetSpeed.phaseEndBaseTargetSpeedCoef * this.stat.speed)
      * constant.targetSpeed.addSpeedParamCoef * distanceProperRate[this._horse.properRate.distanceType[this._course.distanceType]].speed;
  }

  private get maxLastSpurtTargetSpeed(): number {
    return Math.max(
      (this.baseTargetSpeed + this.phaseEndTargetSpeedAddition + constant.targetSpeed.lastSpurtBaseTargetSpeedAddCoef * this._course.baseTargetSpeed)
          * constant.targetSpeed.baseTargetSpeedCoef
        + this.phaseEndTargetSpeedAddition,
      this.minSpeed,
    );
  }

  private get lastSpurtTargetSpeed(): number {
    return this._lastSpurtTargetSpeed;
  }

  private get realTargetSpeed(): number {
    if (this._mode.has(Mode.StartDash) || this._mode.has(Mode.FirstBlock)) {
      return this.startDashTargetSpeed;
    }
    if (this._mode.has(Mode.LastSpurt)) {
      return this.lastSpurtTargetSpeed;
    }

    const slopePer = this._slopePer;
    let slopeAdd = 0;
    if (slopePer >= 1) {
      slopeAdd = -slopePer * constant.targetSpeed.upSlopeAddSpeedVal1 / this.stat.pow;
    } else if (slopePer <= -1 && this._mode.has(Mode.DownSlopeAccel)) {
      slopeAdd = constant.targetSpeed.downSlopeAddSpeedVal1 + Math.abs(slopePer) / constant.targetSpeed.downSlopeAddSpeedVal2;
    }
    return this.baseTargetSpeed + this.baseTargetSpeedRandom + slopeAdd
      + (this._phase >= 2 ? this.phaseEndTargetSpeedAddition : 0);
  }

  get targetSpeed(): number {
    if (this._mode.has(Mode.ZeroHp)) {
      return this.minSpeed;
    }
    return Math.max(this.minSpeed, this.realTargetSpeed);
  }

  refreshSpeedRandomValue(): void {
    this._speedWizRandom = _.random(...this._speedWizRandomRange, true);
  }

  private get baseAccel(): number {
    return constant.accel.accelPhaseCoef[this._runningStyle][this._phase]
      * Math.sqrt(this.stat.pow * constant.accel.accelPowCoefSqrt)
      * groundProperRate[this._horse.properRate.groundType[this._course.groundType]]
      * distanceProperRate[this._horse.properRate.distanceType[this._course.distanceType]].power;
  }

  get accel(): number {
    if (this._mode.has(Mode.ZeroHp)) {
      return constant.accel.accelDecreaseZeroHpCoef;
    }

    if (this._speed <= this.targetSpeed) {
      return (this._mode.has(Mode.StartDash) ? constant.accel.startAccelAdd : 0)
        + this.baseAccel * (this._mode.has(Mode.UpSlope) ? constant.accel.accelPowCoefUpSlope : constant.accel.accelPowCoef);
    }
    return constant.accel.accelDecreaseCoef[this._phase];
  }

  private get phaseEndHpDecreaseRate() {
    return constant.hp.hpGutsBase + constant.hp.hpGutsCoef / Math.sqrt(constant.hp.hpGutsCoefSqrt * this.stat.guts);
  }

  private get modeHpDecreaseRate() {
    if (this._mode.has(Mode.Temptation)) {
      return constant.hp.hpDecRateBaseTemptation;
    }
    if (this._mode.has(Mode.PositionKeepPaceDown)) {
      return constant.hp.hpDecRateBasePositionKeepPaseDown;
    }
    return constant.hp.hpDecRateBaseNormal;
  }

  get hpDecreaseRate(): number {
    return constant.hp.hpDecBase * constant.hp.groundModifierMultiHpSub[this._course.groundType][this._course.groundStatus]
      * (this._phase >= CoursePhase.End ? this.phaseEndHpDecreaseRate : 1)
      * this.modeHpDecreaseRate
      * (this._mode.has(Mode.DownSlopeAccel) ? constant.hp.hpDecRateMultiplyDownSlopeAccelMode : 1);
  }

  get minBreakpoint(): { breakPoint: BreakPoint, distance: number, parameters: any } {
    let minKey: BreakPoint = BreakPoint.None;
    let minDistance: number = Number.MAX_VALUE;
    let minParameters: any;
    for (const [key, value] of Object.entries(this._breakPoints)) {
      let targetValue: BreakPointData;
      if (Array.isArray(value)) {
        targetValue = value[value.length - 1];
      } else {
        targetValue = value;
      }

      if (targetValue.distance !== undefined) {
        if (targetValue.distance < minDistance) {
          minDistance = targetValue.distance;
          minKey = key as BreakPoint;
          minParameters = targetValue.parameters;
        } else if (targetValue.distance === minDistance && key < minKey) {
          minKey = key as BreakPoint;
          minParameters = targetValue.parameters;
        }
      } else if (targetValue.time !== undefined) {
        const distance = this._distance + (targetValue.time - this._time) * this._speed;
        if (distance < minDistance) {
          minDistance = distance;
          minKey = key as BreakPoint;
          minParameters = targetValue.parameters;
        } else if (targetValue.distance === minDistance && key < minKey) {
          minKey = key as BreakPoint;
          minParameters = targetValue.parameters;
        }
      }
    }
    return { breakPoint: minKey, distance: minDistance, parameters: minParameters };
  }

  private static getAccelHpDecrease({
    initialSpeed, accel, time, hpDecreaseRate, baseTargetSpeed,
  }: {
    initialSpeed: number, accel: number, time: number, hpDecreaseRate: number, baseTargetSpeed: number,
  }): number {
    const speedCoefficient = (initialSpeed - baseTargetSpeed + constant.hp.speedGapParam1);
    return hpDecreaseRate
      * (accel ** 2 * time ** 3 / 3 + accel * time ** 2 * speedCoefficient + speedCoefficient ** 2 * time)
      / constant.hp.speedGapParam1Pow;
  }

  private static getSpeedHpDecrease({ speed, hpDecreaseRate, baseTargetSpeed }: { speed: number, hpDecreaseRate: number, baseTargetSpeed: number }) {
    return hpDecreaseRate * (speed - baseTargetSpeed + constant.hp.speedGapParam1) ** 2 / constant.hp.speedGapParam1Pow;
  }

  private static getRunHpDecrease({
    speed, hpDecreaseRate, baseTargetSpeed, time,
  }: {
    speed: number, hpDecreaseRate: number, baseTargetSpeed: number, time: number,
  }): number {
    return RaceHorse.getSpeedHpDecrease({ speed, hpDecreaseRate, baseTargetSpeed }) * time;
  }

  private static accelToTargetSpeed({
    accel, currentSpeed, targetSpeed, maxDistance, hpDecreaseRate, baseTargetSpeed,
  }: {
    accel: number,
    currentSpeed: number,
    targetSpeed: number,
    maxDistance: number,
    hpDecreaseRate: number,
    baseTargetSpeed: number
  }) {
    const targetSpeedByDistanceSquare = currentSpeed ** 2 + 2 * accel * maxDistance;
    const finalSpeed = accel > 0
      ? Math.min(targetSpeed, Math.sqrt(targetSpeedByDistanceSquare))
      : Math.max(targetSpeed, Math.sqrt(Math.max(targetSpeedByDistanceSquare, 0)));
    const time = (finalSpeed - currentSpeed) / accel;
    const distance = (currentSpeed + currentSpeed + accel * time) * time / 2;
    const hpCost = RaceHorse.getAccelHpDecrease({
      initialSpeed: currentSpeed,
      accel,
      time,
      hpDecreaseRate,
      baseTargetSpeed,
    });
    return {
      time, distance, hpCost, finalSpeed,
    };
  }

  private doGateOpen(): void {
    this._time += Math.floor(_.random(constant.course.gateTimeRange.min, constant.course.gateTimeRange.max, true) / constant.course.frameTime)
      * constant.course.frameTime;
    this._mode.add(Mode.StartDash);
    this._breakPoints[BreakPoint.FinishBlock] = { distance: this._course.blockDistance };
    this._breakPoints[BreakPoint.Goal] = { distance: this._course.distance };
  }

  private finishStartDash(): void {
    const { accel, targetSpeed } = this;
    const {
      time, distance, hpCost, finalSpeed,
    } = RaceHorse.accelToTargetSpeed({
      accel,
      currentSpeed: this._speed,
      targetSpeed,
      maxDistance: this._course.distance,
      hpDecreaseRate: this.hpDecreaseRate,
      baseTargetSpeed: this._course.baseTargetSpeed,
    });
    this._time += time;
    this._distance += distance;
    this._hp -= hpCost;
    this._speed = finalSpeed;

    this._mode.delete(Mode.StartDash);
    if (this._runningStyle === RunningStyle.Sashi || this._runningStyle === RunningStyle.Oikomi) {
      this._breakPoints[BreakPoint.FinishFirstBlock] = { distance: this._course.blockDistance };
      this._mode.add(Mode.FirstBlock);
    } else {
      this._breakPoints[BreakPoint.FinishPhaseStart] = { distance: this._course.phaseStartDistance };
    }
  }

  private calculateAccelAndRun(distance: number) {
    const { accel, targetSpeed } = this;
    const {
      time: accelTime, distance: accelDistance, hpCost: accelHpCost, finalSpeed,
    } = RaceHorse.accelToTargetSpeed({
      accel,
      currentSpeed: this._speed,
      targetSpeed,
      maxDistance: distance - this._distance,
      hpDecreaseRate: this.hpDecreaseRate,
      baseTargetSpeed: this._course.baseTargetSpeed,
    });

    const runDistance = (distance - this._distance - accelDistance);
    const runTime = runDistance / finalSpeed;
    const runHpCost = RaceHorse.getRunHpDecrease({
      speed: finalSpeed,
      time: runTime,
      hpDecreaseRate: this.hpDecreaseRate,
      baseTargetSpeed: this._course.baseTargetSpeed,
    });

    return {
      time: accelTime + runTime,
      distance: accelDistance + runDistance,
      hpCost: accelHpCost + runHpCost,
      finalSpeed,
    };
  }

  private doAccelAndRun(distance: number) {
    const { accel, targetSpeed, hpDecreaseRate } = this;
    const {
      time: accelTime, distance: accelDistance, hpCost: accelHpCost, finalSpeed,
    } = RaceHorse.accelToTargetSpeed({
      accel,
      currentSpeed: this._speed,
      targetSpeed,
      maxDistance: distance - this._distance,
      hpDecreaseRate,
      baseTargetSpeed: this._course.baseTargetSpeed,
    });

    if (accelHpCost > this.hp && !this._mode.has(Mode.ZeroHp)) {
      /**
       * Accel HP cost formula:
       * hpDecrease = hpDecreaseRate * (accel^2 * time^3 / 3 + accel * time^2 * speedCoefficient + speedCoefficient^2 * time)/ 144
       * speedCoefficient = initialSpeed - baseTargetSpeed + 12
       * Given accel and initialSpeed, hpDecrease = this.hp is a cubic equation of time.
       * It's hard to get a formula solution, but we can get a approximate value by applying Newton's Method.
       */
      const speedCoefficient = this._speed - this._course.baseTargetSpeed + constant.hp.speedGapParam1;
      const realAccelTime = nr(
        (time: number) => (
          hpDecreaseRate * (accel ** 2 * time ** 3 / 3 + accel * time ** 2 * speedCoefficient + speedCoefficient ** 2 * time)
        ),
        (time: number) => (
          hpDecreaseRate * (accel ** 2 * time ** 2 + accel * time * 2 * speedCoefficient + speedCoefficient ** 2)
        ),
        10,
      );
      const realAccelDistance = (this._speed + this._speed + accel * accelTime) * accelTime / 2;
      this._time += realAccelTime;
      this._distance += realAccelDistance;
      this._hp = 0;
      this._mode.add(Mode.ZeroHp);
      delete this._breakPoints[BreakPoint.ZeroHp];
      return false;
    }

    this._hp -= accelHpCost;
    this._time += accelTime;
    this._distance += accelDistance;
    this._speed = finalSpeed;

    const speedHpDecreaseRate = RaceHorse.getSpeedHpDecrease({
      speed: this._speed,
      hpDecreaseRate,
      baseTargetSpeed: this._course.baseTargetSpeed,
    });
    const runDistance = distance - this._distance;
    const runTime = runDistance / this._speed;
    const runHpCost = speedHpDecreaseRate * runTime;

    if (runHpCost > this.hp && !this._mode.has(Mode.ZeroHp)) {
      const realRunTime = this._hp / speedHpDecreaseRate;
      const realRunDistance = realRunTime * this._speed;
      this._time += realRunTime;
      this._distance += realRunDistance;
      this._hp = 0;
      this._mode.add(Mode.ZeroHp);
      delete this._breakPoints[BreakPoint.ZeroHp];
      return false;
    }

    this._hp -= runHpCost;
    this._time += runTime;
    this._distance += runDistance;
    if (!this._mode.has(Mode.ZeroHp)) {
      this._breakPoints[BreakPoint.ZeroHp] = { distance: this._distance + this.hp / speedHpDecreaseRate * this._speed };
    }
    return true;
  }

  private finishFirstBlock = () => {
    this._mode.delete(Mode.FirstBlock);
    this._breakPoints[BreakPoint.FinishPhaseStart] = { distance: this._course.phaseStartDistance };
  };

  private finishBlock = () => {
    if (!this._mode.has(Mode.LastSpurt) && this._course.distance > this._distance) {
      this.refreshSpeedRandomValue();
      this._breakPoints[BreakPoint.FinishBlock] = { distance: this._distance + this._course.blockDistance };
    }
  };

  private finishPhaseStart = () => {
    this._phase = CoursePhase.Middle;
    this._breakPoints[BreakPoint.FinishPhaseMiddle] = { distance: this._course.phaseMiddleDistance };
  };

  private static randomByCandidates(lastSpurtSpeedCandidates: LastSpurtCandidate[], determineRate: number): LastSpurtCandidate {
    const randomNumber = Math.random();
    const targetItem = Math.min(
      lastSpurtSpeedCandidates.length - 1,
      Math.floor(Math.log(randomNumber) / Math.log(1 - determineRate)),
    );
    return lastSpurtSpeedCandidates[targetItem];
  }

  private calculateLastSpurt = (): { lastSpurtDistance: number, lastSpurtTargetSpeed: number } => {
    this._mode.add(Mode.LastSpurt);
    this._lastSpurtTargetSpeed = this.maxLastSpurtTargetSpeed;
    const { hpCost, finalSpeed } = this.calculateAccelAndRun(this._course.distance - constant.lastSpurt.targetDistanceFromGoal);
    this._mode.delete(Mode.LastSpurt);
    if (hpCost <= this._hp && finalSpeed === this._lastSpurtTargetSpeed) {
      this.resultFlag.add(ResultFlag.FullLastSpurt);
      return {
        lastSpurtDistance: this._distance,
        lastSpurtTargetSpeed: finalSpeed,
      };
    }

    let lastSpurtSpeedCandidates: LastSpurtCandidate[] = [];
    const phaseEndBaseTargetSpeed = this.baseTargetSpeed + this.phaseEndTargetSpeedAddition;
    const maxDistance = this._course.distance - this._distance - constant.lastSpurt.targetDistanceFromGoal;
    const { accel, hpDecreaseRate } = this;
    const { baseTargetSpeed } = this._course;
    for (; this.lastSpurtTargetSpeed >= phaseEndBaseTargetSpeed; this._lastSpurtTargetSpeed -= constant.targetSpeed.lastSpurtTargetSpeedStep) {
      const {
        time: phaseEndAccelTime,
        distance: phaseEndAccelDistance,
        hpCost: phaseEndAccelHpCost,
        finalSpeed: phaseEndFinalSpeed,
      } = RaceHorse.accelToTargetSpeed({
        accel,
        currentSpeed: this._speed,
        targetSpeed: phaseEndBaseTargetSpeed,
        maxDistance,
        hpDecreaseRate,
        baseTargetSpeed,
      });
      const {
        time: lastSpurtAccelTime,
        distance: lastSpurtAccelDistance,
        hpCost: lastSpurtAccelHpCost,
      } = RaceHorse.accelToTargetSpeed({
        accel,
        currentSpeed: phaseEndFinalSpeed,
        targetSpeed: this.lastSpurtTargetSpeed,
        maxDistance: maxDistance - phaseEndAccelDistance,
        hpDecreaseRate,
        baseTargetSpeed,
      });
      const runDistance = maxDistance - phaseEndAccelDistance - lastSpurtAccelDistance;
      const phaseEndRunTime = runDistance / phaseEndBaseTargetSpeed;
      const phaseEndRunHpCost = RaceHorse.getRunHpDecrease({
        speed: phaseEndBaseTargetSpeed,
        time: phaseEndRunTime,
        hpDecreaseRate,
        baseTargetSpeed,
      });
      const lastSpurtRunTime = runDistance / this.lastSpurtTargetSpeed;
      const lastSpurtRunHpCost = RaceHorse.getRunHpDecrease({
        speed: this.lastSpurtTargetSpeed,
        time: lastSpurtRunTime,
        hpDecreaseRate,
        baseTargetSpeed,
      });

      if (this.hp >= phaseEndAccelHpCost + lastSpurtAccelHpCost + lastSpurtRunHpCost) {
        lastSpurtSpeedCandidates.push({
          lastSpurtDistance: this._distance,
          targetSpeed: this.lastSpurtTargetSpeed,
          time: phaseEndAccelTime + lastSpurtAccelTime + lastSpurtRunTime,
        });
      } else if (this.hp >= phaseEndAccelHpCost + lastSpurtAccelHpCost + phaseEndRunHpCost) {
        const hpLeft = this.hp - (phaseEndAccelHpCost + lastSpurtAccelHpCost + phaseEndRunHpCost);
        const hpDiff = lastSpurtRunHpCost - phaseEndRunHpCost;
        lastSpurtSpeedCandidates.push({
          lastSpurtDistance: this._distance + phaseEndAccelDistance + runDistance * (1 - hpLeft / hpDiff),
          targetSpeed: this.lastSpurtTargetSpeed,
          time: phaseEndAccelTime + lastSpurtAccelTime + (hpLeft / hpDiff) * lastSpurtRunTime + (1 - hpLeft / hpDiff) * phaseEndRunTime,
        });
      }
    }
    lastSpurtSpeedCandidates.push({
      lastSpurtDistance: Number.MAX_VALUE,
      targetSpeed: phaseEndBaseTargetSpeed,
      time: Number.MAX_VALUE,
    });
    lastSpurtSpeedCandidates = _.sortBy(lastSpurtSpeedCandidates, ['time']);
    const candidate = RaceHorse.randomByCandidates(lastSpurtSpeedCandidates, this.lastSpurtDetermineRate);
    return {
      lastSpurtDistance: candidate.lastSpurtDistance,
      lastSpurtTargetSpeed: candidate.targetSpeed,
    };
  };

  private finishPhaseMiddle = () => {
    this._phase = CoursePhase.End;
    const { lastSpurtDistance, lastSpurtTargetSpeed } = this.calculateLastSpurt();
    this._breakPoints[BreakPoint.FinishPhaseEnd] = { distance: this._course.phaseEndDistance };
    this._breakPoints[BreakPoint.LastSpurt] = { distance: lastSpurtDistance };
    this._lastSpurtTargetSpeed = lastSpurtTargetSpeed;
  };

  private finishPhaseEnd = () => {
    this._phase = CoursePhase.LastSpurt;
    this._breakPoints[BreakPoint.FinishPhaseLastSpurt] = { distance: this._course.distance };
  };

  private doLastSpurt = () => {
    this._mode.add(Mode.LastSpurt);
    delete this._breakPoints[BreakPoint.FinishBlock];
  };

  private finishLastSpurt = () => {};

  private triggerPositionSense = () => {};

  private zeroHp = () => {
    if (this.hp <= 0) {
      this._mode.add(Mode.ZeroHp);
    }
  };

  private changeSlope = ({ slopePer }: { slopePer: number }) => {
    if (this._slopePer > -1 && slopePer <= -1) {
      this.checkDownSlopeAccelMode();
    } else if (this._slopePer <= -1 && slopePer > -1) {
      this._mode.delete(Mode.DownSlopeAccel);
      delete this._breakPoints[BreakPoint.DownSlopeAccelMode];
    }
    this._slopePer = slopePer;
  };

  private checkDownSlopeAccelMode = () => {
    if (this._mode.has(Mode.DownSlopeAccel)) {
      if (Math.random() <= constant.slope.downSlopeEndChance) {
        this._mode.delete(Mode.DownSlopeAccel);
      } else {
        this._breakPoints[BreakPoint.DownSlopeAccelMode] = { time: this._time + 1 };
      }
    } else {
      if (Math.random() <= this.stat.wiz * constant.slope.downSlopeAccelModeChanceBase) {
        this._mode.add(Mode.DownSlopeAccel);
        this._breakPoints[BreakPoint.DownSlopeAccelMode] = { time: this._time + 1 };
      }
    }
  };

  private triggerSkill = () => {};

  private reachGoal = () => {
    this._breakPoints = {};
  };

  private readonly breakPointMap: { [key in BreakPoint]: (parameters: any) => void } = {
    [BreakPoint.None]: () => {},
    [BreakPoint.FinishFirstBlock]: this.finishFirstBlock,
    [BreakPoint.FinishBlock]: this.finishBlock,
    [BreakPoint.FinishPhaseStart]: this.finishPhaseStart,
    [BreakPoint.FinishPhaseMiddle]: this.finishPhaseMiddle,
    [BreakPoint.FinishPhaseEnd]: this.finishPhaseEnd,
    [BreakPoint.LastSpurt]: this.doLastSpurt,
    [BreakPoint.FinishPhaseLastSpurt]: this.finishLastSpurt,
    [BreakPoint.PositionSense]: this.triggerPositionSense,
    [BreakPoint.ZeroHp]: this.zeroHp,
    [BreakPoint.Slope]: this.changeSlope,
    [BreakPoint.DownSlopeAccelMode]: this.checkDownSlopeAccelMode,
    [BreakPoint.Skill]: this.triggerSkill,
    [BreakPoint.Goal]: this.reachGoal,
  };

  buildSlopeBreakPoints() {
    const slopePers = this._course.allSlopePers;
    for (let i = slopePers.length - 1; i > 0; i -= 1) {
      this.addBreakPoint(BreakPoint.Slope, {
        distance: slopePers[i].distance,
        parameters: {
          slopePer: slopePers[i].slope_per,
        },
      });
    }
  }

  addBreakPoint(type: BreakPoint, data: BreakPointData) {
    switch (type) {
      case BreakPoint.Skill:
      case BreakPoint.Slope:
        if (!(type in this._breakPoints)) {
          this._breakPoints[type] = [data];
        } else {
          this._breakPoints[type]?.push(data);
        }
        break;
      default:
        this._breakPoints[type] = data;
        break;
    }
  }

  removeBreakPoint(type: BreakPoint) {
    switch (type) {
      case BreakPoint.Skill:
      case BreakPoint.Slope:
        this._breakPoints[type]?.pop();
        if (this._breakPoints[type]?.length === 0) {
          delete this._breakPoints[type];
        }
        break;
      default:
        delete this._breakPoints[type];
        break;
    }
  }

  simulate() {
    this._speed = constant.course.startSpeed;
    this._time = 0;
    this._distance = 0;
    this._hp = this.maxHp;
    this._mode = new Set();
    this._phase = CoursePhase.Start;
    this._breakPoints = {};

    this.buildSlopeBreakPoints();
    this.doGateOpen();
    this.debugOutput();
    this.finishStartDash();
    this.debugOutput();

    while (Object.keys(this._breakPoints).length > 0) {
      const { breakPoint, distance, parameters } = this.minBreakpoint;
      if (this.doAccelAndRun(distance)) {
        this.removeBreakPoint(breakPoint);
        this.breakPointMap[breakPoint](parameters);
      }
      this.debugOutput();
    }
  }

  debugOutput() {
    return;
    const debugData = {
      hp: this.hp,
      speed: this._speed,
      time: this._time,
      distance: this._distance,
      phase: this._phase,
      mode: Array.from(this._mode),
      breakPoints: util.inspect(this._breakPoints, { depth: null }),
      slopePer: this._slopePer,
    };
    console.log(debugData);
  }
}

export default RaceHorse;
