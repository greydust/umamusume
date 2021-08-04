import React, { Component } from 'react';
import {
  ReferenceDot, ComposedChart, Line, XAxis, YAxis, Tooltip, ReferenceLine, Legend, ReferenceArea, Label,
} from 'recharts';

import {
  CourseCategory, CourseDataType, LocalizationData,
} from '../../library/common';

import 'react-tabs/style/react-tabs.css';

const CORNER_COLOR: { [key: string]: any } = {
  Default: {
    stroke: '#00ff00',
    strokeOpacity: 0.3,
    fill: '#00ff00',
    fillOpacity: 0.3,
  },
  1: {
    stroke: '#00bb00',
    strokeOpacity: 0.3,
    fill: '#00bb00',
    fillOpacity: 0.3,
  },
  2: {
    stroke: '#009900',
    strokeOpacity: 0.3,
    fill: '#009900',
    fillOpacity: 0.3,
  },
  3: {
    stroke: '#00f660',
    strokeOpacity: 0.3,
    fill: '#006600',
    fillOpacity: 0.3,
  },
  4: {
    stroke: '#003300',
    strokeOpacity: 0.3,
    fill: '#003300',
    fillOpacity: 0.3,
  },
};

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
    let maxSlope = 3;
    let minSlope = -3;
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
      maxSlope = slope.slope_per > maxSlope ? slope.slope_per : maxSlope;
      minSlope = slope.slope_per < minSlope ? slope.slope_per : minSlope;
      data.push({
        slopePer: slope.slope_per,
        distance: slope.distance,
      });
      lastSlopePer = slope.slope_per;
      lastSlopePerDistance = slope.distance;
    }
    maxSlope = Math.ceil(maxSlope)
    minSlope = Math.floor(minSlope)

    if (lastSlopePer !== course.distance) {
      data.push({
        slopePer: 0,
        distance: course.distance,
      });
    }
    const referenceDots = [];
    const referenceAreas = [];
    for (let i = 0; i < course.param.corner.length; i += 1) {
      let index = 'Default';
      if (course.param.corner_index.includes(i)) {
        index = (course.param.corner_index.indexOf(i) + 1).toString();
      }

      if (i == 0 || course.param.corner[i-1].end != course.param.corner[i].start){
        referenceDots.push(<ReferenceDot  
          x={course.param.corner[i].start}
          y={minSlope + (maxSlope - minSlope)/12}
          label={<Label position="insideTop">{course.param.corner[i].start}</Label>}
        />)
      }
      referenceDots.push(<ReferenceDot  
        x={course.param.corner[i].end}
        y={minSlope + (maxSlope - minSlope)/12}
        label={<Label position="insideTop">{course.param.corner[i].end}</Label>}
      />)

      referenceAreas.push(<ReferenceArea
        x1={course.param.corner[i].start}
        x2={course.param.corner[i].end}
        y1={minSlope + (maxSlope - minSlope)/12}
        y2={minSlope}
        stroke={CORNER_COLOR[index].stroke}
        strokeOpacity={CORNER_COLOR[index].strokeOpacity}
        fill={CORNER_COLOR[index].fill}
        fillOpacity={CORNER_COLOR[index].fillOpacity}
        label={<Label position="insideTop">{localization.site[`CourseCorner${index}`]}</Label>}
      />);
    }
    return (
      <ComposedChart
        width={1000}
        height={500}
        data={data}
      >
        <XAxis type="number" dataKey="distance" />
        <YAxis domain={[minSlope, maxSlope]} />
        <Tooltip />
        <Legend />
        <Line dot={false} name={localization.site.CourseSlope} type="monotone" dataKey="slopePer" stroke="#8884d8" />
        <ReferenceLine
          x={blockDistance * 10}
          stroke="red"
          label={<Label position="insideTop">{localization.site.CoursePositionKeepEnd}</Label>}
        />
        <ReferenceLine
          x={blockDistance * 4}
          stroke="red"
          label={<Label position="insideTop">{localization.site.CourseMiddlePhase}</Label>}
        />
        <ReferenceLine
          x={blockDistance * 16}
          stroke="red"
          label={<Label position="insideTop">{localization.site.CourseEndPhase}</Label>}
        />
        { referenceAreas }
        { referenceDots }
      </ComposedChart>
    );
  }
}

export default CourseChart;
