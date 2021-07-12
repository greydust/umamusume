import { RunningStyle } from '../common';
import Course from './course';

export enum ResultFlag {
  FullLastSpurt,
}

export enum Season {
  Spring = '1',
  Summer = '2',
  Fall = '3',
  Winter = '4',
}

export enum Weather {
  Sunny = '1',
  Cloudy = '2',
  Rainy = '3',
  Snowy = '4',
}

export interface RaceResultData {
  time: number,
  hpLeft: number,
  resultFlags: Set<ResultFlag>,
  skillsActivated: {
    [key: string]: {
      count: number,
    },
  },
  temptation: {
    triggered: boolean,
    time: number,
  },
}

export interface IRaceHorse {
  get course(): Course;
  get season(): Season;
  get weather(): Weather;
  get postNumber(): number;
  get popularity(): number;
  get sameRunningStyleCount(): number;
  get popularityFirstRunningStyle(): RunningStyle;
  get runningStyle(): RunningStyle;
}

class Common {
}

export default Common;
