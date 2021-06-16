export enum RunningStyle {
  Nige,
  Senko,
  Sashi,
  Oikomi,
}

export enum CoursePhase {
  Start = 0,
  Middle,
  End,
  LastSpurt,
}

export enum ProperRate {
  G = "1",
  F = "2",
  E = "3",
  D = "4",
  C = "5",
  B = "6",
  A = "7",
  S = "8",
}

const constant = {
  baseDistance: 2000,
  distanceCoefficient: 0.001,
  minSpeed: {
    minSpeedRate: 0.85,
    minSpeedGutsCoefSqrt: 200,
    minSpeedGutsCoef: 0.001,
  },
  startDash: {
    targetSpeedCoefficient: 0.85,
    startAccelAdd: 24,
  },
  targetSpeed: {
    baseTargetSpeedRandomMinusVal1: -0.65,
    baseTargetSpeedRandomMinusVal2: 5500,
    baseTargetSpeedRandomPlusVal1: 5500,
    baseTargetSpeedRandomLogCoefficient: 0.1,
    baseTargetSpeedRandomCoefficient: 0.01,
    targetSpeedCoefficient: {
      [RunningStyle.Nige]: {
        [CoursePhase.Start]: 1,
        [CoursePhase.Middle]: 0.98,
        [CoursePhase.End]: 0.98,
      },
      [RunningStyle.Senko]: {
        [CoursePhase.Start]: 0.978,
        [CoursePhase.Middle]: 0.991,
        [CoursePhase.End]: 0.975,
      },
      [RunningStyle.Sashi]: {
        [CoursePhase.Start]: 0.938,
        [CoursePhase.Middle]: 0.998,
        [CoursePhase.End]: 0.994,
      },
      [RunningStyle.Oikomi]: {
        [CoursePhase.Start]: 0.931,
        [CoursePhase.Middle]: 1,
        [CoursePhase.End]: 1,
      },
    },
    phaseEndBaseTargetSpeedCoef: 500,
    addSpeedParamCoef: 0.002,
    baseTargetSpeedCoef: 1.05,
    lastSpurtBaseTargetSpeedAddCoef: 0.01,
    lastSpurtTargetSpeedCoefSqrt: 500,
  },
};

export default constant;
