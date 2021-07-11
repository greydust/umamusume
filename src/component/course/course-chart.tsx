import React, { Component } from 'react';
import {
  ComposedChart, Line, XAxis, YAxis, Area, Tooltip, ReferenceLine, Legend,
} from 'recharts';

import {
  CourseCategory, CourseDataType, LocalizationData,
} from '../../library/common';

import 'react-tabs/style/react-tabs.css';

interface IProps {
  localization: LocalizationData
  state: {
    course?: CourseDataType,
  }
}

interface IState {
}

class CourseChart extends Component<IProps, IState> {
  private courseCategories: CourseCategory = {};

  render() {
    const { localization, state } = this.props;
    const { course } = state;

    if (course === undefined) {
      return (<></>);
    }

    const blockDistance = course.distance / 24;
    const slopeDistance = course.distance / 1000;
    let lastSlopePer = 0;
    let lastSlopePerDistance = 0;
    const data = [];
    for (const slope of course.slope_per) {
      if (lastSlopePer === 0 && slope.slope_per !== 0 && lastSlopePerDistance < slope.distance - slopeDistance) {
        data.push({
          slopePer: 0,
          distance: slope.distance - slopeDistance,
        });
      }

      data.push({
        slopePer: slope.slope_per,
        distance: slope.distance,
      });
      lastSlopePer = slope.slope_per;
      lastSlopePerDistance = slope.distance;
    }

    for (let i = 0; i < course.param.corner.length; i += 1) {
      if (course.param.corner_index.includes(i)) {
        const index = course.param.corner_index.indexOf(i) + 1;
        data.push({
          distance: course.param.corner[i].start,
          [`corner${index}`]: [-3, 3],
        });
        data.push({
          distance: course.param.corner[i].end,
          [`corner${index}`]: [-3, 3],
        });
      } else {
        data.push({
          distance: course.param.corner[i].start,
          corner: [-3, 3],
        });
        data.push({
          distance: course.param.corner[i].end,
          corner: [-3, 3],
        });
      }
    }
    return (
      <ComposedChart
        width={1000}
        height={500}
        data={data}
      >
        <XAxis type="number" dataKey="distance" />
        <YAxis domain={[-3, 3]} />
        <Tooltip />
        <Legend />
        <Line name={localization.site.CourseSlope} type="monotone" dataKey="slopePer" stroke="#8884d8" />
        <ReferenceLine
          x={blockDistance * 10}
          stroke="red"
          label={`${localization.site.CoursePositionKeep}${localization.site.CourseEnd}`}
        />
        <ReferenceLine
          x={blockDistance * 4}
          stroke="red"
          label={`${localization.site.CourseMiddlePhase}`}
        />
        <ReferenceLine
          x={blockDistance * 16}
          stroke="red"
          label={`${localization.site.CourseEndPhase}`}
        />
        <Area name={localization.site.CourseCorner} type="monotone" dataKey="corner" fill="#00ff00" stroke="#00ff00" />
        <Area name={localization.site.CourseCorner1} type="monotone" dataKey="corner1" fill="#00bb00" stroke="#00bb00" />
        <Area name={localization.site.CourseCorner2} type="monotone" dataKey="corner2" fill="#009900" stroke="#009900" />
        <Area name={localization.site.CourseCorner3} type="monotone" dataKey="corner3" fill="#006600" stroke="#006600" />
        <Area name={localization.site.CourseCorner4} type="monotone" dataKey="corner4" fill="#003300" stroke="#003300" />
      </ComposedChart>
    );
  }
}

export default CourseChart;
