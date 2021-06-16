import constant from './constant';

class Course {
  private _distance: number;

  constructor(distance: number) {
    this._distance = distance;
  }

  get distance(): number {
    return this._distance;
  }

  get baseTargetSpeed(): number {
    return 20 - (this._distance - constant.baseDistance) * constant.distanceCoefficient;
  }
}

export default Course;
