import React, { createContext, useContext } from 'react';
import { scaleLinear } from '@visx/scale';
import { Group } from '@visx/group';
import { AxisBottom, AxisLeft } from '@visx/axis';
import { Line, LinePath, Circle } from '@visx/shape';
import { ParentSize } from '@visx/responsive';
import { Text } from '@visx/text';
import { curveLinear } from '@visx/curve';
import { makeStyles } from '@material-ui/core/styles';
import COLORS from "../../colors";

/** Set the tick style
    axis.selectAll(".tick line")
      .attr("stroke", d === "x" ? xColor : yColor)
      .attr("stroke-width", 1.5)
      .attr("stroke-linecap", "round");
      */

const useStyles = makeStyles({
  tick: {
    '& text': {
      fontFamily: "Quicksand,sans-serif",
    },
    '& line': {
      strokeWidth: 2,
      strokeLinecap: "round",
    }
  },
  xTick: {
    '& text': {
      fontSize: props => props.xFontSize,
      fill: props => props.xColor,
    },
    '& line': {
      stroke: props => props.xColor,
    }
  },
  yTick: {
    '& text': {
      fontSize: props => props.yFontSize,
      fill: props => props.yColor,
    },
    '& line': {
      stroke: props => props.yColor,
    }
  },
  axisLine: {
    strokeWidth: 2,
    strokeLinecap: "round",
  },
  xAxisLine: {
    stroke: props => props.xColor,
  },
  yAxisLine: {
    stroke: props => props.yColor,
  },
  axisLabel: {
    fontFamily: "Quicksand,sans-serif",
    fontSize: 20,
  },
  xAxisLabel: {
    fill: props => props.xColor,
  },
  yAxisLabel: {
    fill: props => props.yColor,
  }
});

const PlotContext = createContext();

const _Plot = ({
  children=null, width, height, top, right, bottom, left,
  xMin, yMin, xMax, yMax,
  xTicks, yTicks,
  xLabel, yLabel,
  xTickFormat, yTickFormat,
  xColor, yColor,
  xFontSize, yFontSize,
  xAxisMargin, yAxisMargin
}) => {
  /**
  d3.formatDefaultLocale({
    "decimal": ",",
    "thousands": " ",
    "grouping": [3],
    "currency": ["€\u00a0", ""]
  })
  **/

  xTicks = xTicks || Math.min(10, Math.max((width - right - left) / 50, 2));

  yTicks = yTicks || Math.min(10,  Math.max(2, (height - top - bottom) / 50));

  const xScale = scaleLinear({
      range: [left + xAxisMargin, width - right - xAxisMargin],
      domain: [xMin, xMax],
      round: false
  });

  const yScale = scaleLinear({
      range: [height - bottom - yAxisMargin, top + yAxisMargin],
      domain: [yMin, yMax],
      round: false
  });

  const classes = useStyles({
    xFontSize: xFontSize,
    yFontSize: yFontSize,
    xColor: xColor,
    yColor: yColor,
  });
  
  const arrowPathD = "m8.7186 4.0337-10.926-4.0177 10.926-4.0177c-1.7455 2.3721-1.7354 5.6175-6e-7 8.0354z";

  return (
    <PlotContext.Provider value={{xScale: xScale, yScale: yScale, xMin: xMin, xMax: xMax}}>
    <svg width={width} height={height}>
        <Group left={xScale(0)}>
          <AxisLeft scale={yScale} numTicks={yTicks} tickFormat={yTickFormat} hideAxisLine={true} tickClassName={`${classes.tick} ${classes.yTick}`}/>
          <Line from={{x: 0, y: yScale(yMin) + yAxisMargin}} to={{x: 0, y: yScale(yMax) - yAxisMargin}} className={`${classes.axisLine} ${classes.yAxisLine}`}/>
          <Text x={10} y={yScale(yMax) - yAxisMargin + 10} textAnchor="start" className={`${classes.axisLabel} ${classes.yAxisLabel}`}>
          { yLabel }
          </Text>
          <path fill={yColor} stroke={yColor} strokeLinejoin="round" transform={`translate(0, ${yScale(yMax) - yAxisMargin}) rotate(90) scale(1.1)`} d={arrowPathD}/>
        </Group>
        <Group top={yScale(0)}>
          <AxisBottom scale={xScale} numTicks={xTicks} tickFormat={xTickFormat} hideAxisLine={true} tickClassName={`${classes.tick} ${classes.xTick}`}/>
          <Line from={{x: xScale(xMin) - xAxisMargin, y: 0}} to={{x: xScale(xMax) + xAxisMargin, y: 0}} className={`${classes.axisLine} ${classes.xAxisLine}`}/>
          <Text x={xScale(xMax) + xAxisMargin} y={-10} textAnchor="end" className={`${classes.axisLabel} ${classes.xAxisLabel}`}>
          { xLabel }
          </Text>
          <path fill={xColor} stroke={xColor} strokeLinejoin="round" transform={`translate(${xScale(xMax) + xAxisMargin}, 0) rotate(180) scale(1.1)`} d={arrowPathD}/>
        </Group>
        {
            children
        }
    </svg>
    </PlotContext.Provider>
  );
}

const Plot = ({
  children=null,
  aspect=1.0,
  top=0.02, right=0.02, bottom=0.02, left=0.02,
  xMin=-10, yMin=-10, xMax=10, yMax=10,
  xTicks=null, yTicks=null,
  xLabel="x", yLabel="y",
  xTickFormat=(d, i) => d, yTickFormat=(d, i) => d,
  xColor=COLORS.ORANGE, yColor=COLORS.GREEN,
  xFontSize=14, yFontSize=14,
  xAxisMargin=0.05, yAxisMargin=0.05
}) => {
  return (
    <ParentSize>
    {
      ({width}) => {
        const height = width/aspect;
        return (
          <_Plot children={children} width={width} height={height} 
            top={top*height} right={right*width} bottom={bottom*height} left={left*width}
            xMin={xMin} yMin={yMin} xMax={xMax} yMax={yMax}
            xTicks={xTicks} yTicks={yTicks}
            xLabel={xLabel} yLabel={yLabel}
            xTickFormat={xTickFormat} yTickFormat={yTickFormat}
            xColor={xColor} yColor={yColor}
            xFontSize={xFontSize} yFontSize={yFontSize}
            xAxisMargin={xAxisMargin*width} yAxisMargin={yAxisMargin*height} />
        );
      }
    }
    </ParentSize>
  );
};

const useStylesFx = makeStyles({
  fx: {
    fill: "none",
    stroke: props => props.color, 
    strokeWidth: props => props.lineWidth, 
    strokeLinecap: "round", 
    strokeLinejoin: "round", 
    shapeRendering: "geometricPrecision"
  }
});

const Fx = ({fx, nSamples=null, xStart=null, xEnd=null, color="blue", lineWidth=3}) => {
  const classes = useStylesFx({color: COLORS[color.toUpperCase()], lineWidth: lineWidth});
  const {xScale, yScale, xMin, xMax} = useContext(PlotContext);
  xStart = xStart || xMin;
  xEnd = xEnd || xMax;
  nSamples = nSamples ? Math.round(nSamples) : Math.round(xScale(xEnd - xStart));
  const xs = [...Array(nSamples + 1).keys()].map((x, i) => x*(xEnd - xStart)/nSamples + xStart);
  return (
    <LinePath data={xs} x={x => xScale(x)} y={x => yScale(fx(x))} curve={curveLinear} className={classes.fx}/>
  );
};

const Point = ({x, y, color="blue", size=3}) => {
  const classes = useStylesFx({color: COLORS[color.toUpperCase()], lineWidth: size});
  const {xScale, yScale} = useContext(PlotContext);
  return <Line from={{x: xScale(x), y: yScale(y)}} to={{x: xScale(x), y: yScale(y)}} className={classes.fx}/>
};

export { Plot, Fx, Point };