import constant from './constant';
import {
  DistanceType, GroundType, GroundStatus, CourseDataType, TurnType,
} from '../../common';

class Course {
  private _courseData: CourseDataType;

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

  constructor({ courseData, groundStatus } : { courseData: CourseDataType, groundStatus: GroundStatus }) {
    this._courseData = courseData;
    this.groundStatus = groundStatus;
  }

  get distance(): number {
    return this._courseData.distance;
  }

  get distanceType(): DistanceType {
    return Course.getDistanceType(this.distance);
  }

  get groundType(): GroundType {
    return this._courseData.ground;
  }

  get turnType(): TurnType {
    return this._courseData.turn;
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
    return 20 - (this.distance - constant.baseDistance) * constant.course.distanceTargetSpeedCoefficient;
  }

  get allSlopePers(): { distance: number, slope_per: number }[] {
    return this._courseData.slope_per;
  }
}

export default Course;
