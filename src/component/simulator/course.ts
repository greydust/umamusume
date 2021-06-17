import constant, { GroundType, GroundStatus, DistanceType } from './constant';

class Course {
  private _distance: number;

  distanceType: DistanceType;

  groundType: GroundType;

  groundStatus: GroundStatus;

  static getDistanceType(distance: number): DistanceType {
    if (distance >= constant.course.distanceShort.min && distance <= constant.course.distanceShort.max) {
      return DistanceType.Short;
    }
    if (distance >= constant.course.distanceMile.min && distance <= constant.course.distanceMile.max) {
      return DistanceType.Mile;
    }
    if (distance >= constant.course.distanceMiddle.min && distance <= constant.course.distanceMiddle.max) {
      return DistanceType.Middle;
    }
    if (distance >= constant.course.distanceLong.min && distance <= constant.course.distanceLong.max) {
      return DistanceType.Long;
    }
    return DistanceType.Long;
  }

  constructor({ distance, groundType, groundStatus } : { distance: number, groundType: GroundType, groundStatus: GroundStatus }) {
    this._distance = distance;
    this.distanceType = Course.getDistanceType(distance);
    this.groundType = groundType;
    this.groundStatus = groundStatus;
  }

  get distance(): number {
    return this._distance;
  }

  get blockDistance(): number {
    return this.distance * constant.course.blockPortion;
  }

  get phaseStartDistance(): number {
    return this.distance * constant.course.phaseStart;
  }

  get phaseMiddleDistance(): number {
    return this.distance * constant.course.phaseMiddle;
  }

  get phaseMiddleEnd(): number {
    return this.distance * constant.course.phaseEnd;
  }

  get positionSenseDistance(): number {
    return this.distance * constant.course.positionSense;
  }

  get baseTargetSpeed(): number {
    return 20 - (this._distance - constant.baseDistance) * constant.course.distanceTargetSpeedCoefficient;
  }

  getSlopePer = (distance: number) => 0;
}

export default Course;
