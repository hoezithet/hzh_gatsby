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

const ARROW = "m8.7186 4.0337-10.926-4.0177 10.926-4.0177c-1.7455 2.3721-1.7354 5.6175-6e-7 8.0354z";
const [ARROW_WIDTH, ARROW_HEIGHT] = [12.35, 9.46667];

const useStyles = makeStyles({
    plot: {
        display: "block",
        margin: "auto"
    },
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

    return (
        <PlotContext.Provider value={{xScale: xScale, yScale: yScale, xMin: xMin, xMax: xMax, width: width, height: height}}>
            <svg width={width} height={height} className={classes.plot} >
                <Group left={xScale(0)}>
                    <AxisLeft scale={yScale} numTicks={yTicks} tickFormat={yTickFormat} hideAxisLine={true} tickClassName={`${classes.tick} ${classes.yTick}`}/>
                    <Line from={{x: 0, y: yScale(yMin) + yAxisMargin}} to={{x: 0, y: yScale(yMax) - yAxisMargin}} className={`${classes.axisLine} ${classes.yAxisLine}`}/>
                    <Text x={10} y={yScale(yMax) - yAxisMargin + 10} textAnchor="start" className={`${classes.axisLabel} ${classes.yAxisLabel}`}>
                        { yLabel }
                    </Text>
                    <path fill={yColor} stroke={yColor} strokeLinejoin="round" transform={`translate(0, ${yScale(yMax) - yAxisMargin}) rotate(90) scale(1.1)`} d={ARROW}/>
                </Group>
                <Group top={yScale(0)}>
                    <AxisBottom scale={xScale} numTicks={xTicks} tickFormat={xTickFormat} hideAxisLine={true} tickClassName={`${classes.tick} ${classes.xTick}`}/>
                    <Line from={{x: xScale(xMin) - xAxisMargin, y: 0}} to={{x: xScale(xMax) + xAxisMargin, y: 0}} className={`${classes.axisLine} ${classes.xAxisLine}`}/>
                    <Text x={xScale(xMax) + xAxisMargin} y={-10} textAnchor="end" className={`${classes.axisLabel} ${classes.xAxisLabel}`}>
                        { xLabel }
                    </Text>
                    <path fill={xColor} stroke={xColor} strokeLinejoin="round" transform={`translate(${xScale(xMax) + xAxisMargin}, 0) rotate(180) scale(1.1)`} d={ARROW}/>
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
    top=0.05, right=0.05, bottom=0.05, left=0.05,
    xMin=-10, yMin=-10, xMax=10, yMax=10,
    xTicks=null, yTicks=null,
    xLabel="x", yLabel="y",
    xTickFormat=(d, i) => d, yTickFormat=(d, i) => d,
    xColor=COLORS.ORANGE, yColor=COLORS.GREEN,
    xFontSize=14, yFontSize=14,
    xAxisMargin=0.05, yAxisMargin=0.05,
    maxWidth=500
}) => {
    return (
        <ParentSize>
            {
            ({width}) => {
            width = Math.min(width, maxWidth);
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
    nSamples = nSamples ? Math.round(nSamples) : Math.round(xScale(xEnd) - xScale(xStart));
    const xs = [...Array(nSamples).keys()].map((x, i) => x*(xEnd - xStart)/nSamples + xStart);
    return (
        <LinePath data={xs} x={x => xScale(x)} y={x => yScale(fx(x))} curve={curveLinear} className={classes.fx}/>
    );
};

const Point = ({x, y, color="blue", size=3}) => {
    const classes = useStylesFx({color: COLORS[color.toUpperCase()], lineWidth: size});
    const {xScale, yScale} = useContext(PlotContext);
    return <Line from={{x: xScale(x), y: yScale(y)}} to={{x: xScale(x), y: yScale(y)}} className={classes.fx}/>
};

const useStylesAnnot = makeStyles({
    parentDiv: {
        height: "100%",
        width: "100%",
        display: "flex",
        alignItems: props => props.alignItems,
        justifyContent: props => props.justifyContent,
        '& p': {
            margin: "0",  // Remove paragraph margin
        }
    }
});

const Annot = ({
    xAnnot, yAnnot, xTarget, yTarget, margin=10,
    anchorAngleTarget=null, anchorRadiusTarget=20,
    anchorAngleAnnot=null, anchorRadiusAnnot=20,
    lineColor="light_gray", lineWidth=2,
    arrow=true,
    children
}) => {
    const {xScale, yScale, width, height} = useContext(PlotContext);

    if (xScale && yScale) {
        [xTarget, xAnnot] = [xTarget, xAnnot].map(xScale);
        [yTarget, yAnnot] = [yTarget, yAnnot].map(yScale);
    }
    
    const sign = x => x >= 0 ? 1 : -1;  // We defign sign(0) = 1 to avoid a collapse when e.g. dx = 0
    const toRad = a => (a / 180) * Math.PI;
    const toDeg = a => (a * 180) / Math.PI;

    const calcAnchorAngleAnnot = (dx, dy) => {
        if (Math.abs(dx) >= Math.abs(dy)) {
            // If moved more horizontally than vertically, put line on left/right
            return dx >= 0 ? 0 : Math.PI;
        } else {
            // Else, put line on top/bottom
            return dy >= 0 ? Math.PI/2 : -Math.PI/2;
        }
    };
    
    const calcAnchorAngleTarget = (dx, dy) => {
        if (dx >= 0 && dy >=0) {
            // Target is on bottom right of annot
            return -3*Math.PI/4;
        } else if (dx >= 0 && dy < 0) {
            // Target is on top right of annot
            return 3*Math.PI/4;
        } else if (dx < 0 && dy >= 0) {
            // Target is on bottom left of annot
            return -Math.PI/4;
        } else {
            // Target is on top left of annot
            return Math.PI/4;
        }
    };

    const [dx, dy] = [xTarget - xAnnot, yTarget - yAnnot];
    anchorAngleTarget = anchorAngleTarget === null ? calcAnchorAngleTarget(dx, dy) : toRad(anchorAngleTarget);
    anchorAngleAnnot = anchorAngleAnnot === null ? calcAnchorAngleAnnot(dx, dy) : toRad(anchorAngleAnnot);

    let [xTargetLine, yTargetLine, xAnnotLine, yAnnotLine] = [
        xTarget + margin * Math.cos(anchorAngleTarget),
        yTarget + margin * Math.sin(anchorAngleTarget),
        xAnnot + margin * Math.cos(anchorAngleAnnot),
        yAnnot + margin * Math.sin(anchorAngleAnnot),
    ];
    let [xTargetAnch, yTargetAnch, xAnnotAnch, yAnnotAnch] = [
        xTargetLine + anchorRadiusTarget * Math.cos(anchorAngleTarget),
        yTargetLine + anchorRadiusTarget * Math.sin(anchorAngleTarget),
        xAnnotLine + anchorRadiusAnnot * Math.cos(anchorAngleAnnot),
        yAnnotLine + anchorRadiusAnnot * Math.sin(anchorAngleAnnot),
    ];

    let arrowX, arrowY, arrowAngle;

    if (arrow) {
        [arrowX, arrowY] = [xTargetLine, yTargetLine];
        arrowAngle = toDeg(anchorAngleTarget);
        [xTargetLine, xTargetAnch] = [xTargetLine, xTargetAnch].map(
            x => x + 2/3 * ARROW_WIDTH * Math.cos(anchorAngleTarget),
        );
        [yTargetLine, yTargetAnch] = [yTargetLine, yTargetAnch].map(
            y => y + 2/3 * ARROW_WIDTH * Math.sin(anchorAngleTarget),
        );
    }

    const [justifyContent, alignItems] = [
        // justifyContent = horizontal alignment
        xAnnotAnch === xAnnotLine ? 
        "center"
        : (
            xAnnotAnch > xAnnotLine ?
            "flex-end"  // Right
            : "flex-start"  // Left
        ),
        // alignItems = vertical alignment
        yAnnotAnch === yAnnotLine ? 
        "center"
        : (
            yAnnotAnch > yAnnotLine ?
            "flex-end"  // Bottom
            : "flex-start"  // Top
        ),
    ];

    const classes = useStylesAnnot({justifyContent: justifyContent, alignItems: alignItems}); 
    const [xChild, yChild] = [
        justifyContent === "center" ?
        xAnnot - width/2
        : (
            justifyContent === "flex-end" ?
            xAnnot - width
            : xAnnot
        ),
        alignItems === "center" ?
        yAnnot - height/2
        : (
            alignItems === "flex-end" ?
            yAnnot - height
            : yAnnot
        ),
    ];

    const color = COLORS[lineColor.toUpperCase()];

    return (
        <>
        <foreignObject x={xChild} y={yChild} width={`${width}`} height={`${height}`}>
            <div xmlns="http://www.w3.org/1999/xhtml" className={classes.parentDiv}>
                { children }
            </div>
        </foreignObject>
        <path d={`M ${xTargetLine} ${yTargetLine} C ${xTargetAnch} ${yTargetAnch}, ${xAnnotAnch} ${yAnnotAnch}, ${xAnnotLine} ${yAnnotLine}`}
        stroke={color} fill="#00000000"
        strokeLinecap="round" strokeWidth={lineWidth}/>
        { arrow ?
            <path fill={color} stroke={color} strokeLinejoin="round"
                transform={`translate(${arrowX}, ${arrowY}) rotate(${arrowAngle})`} d={ARROW}/>
            : null }
        </>
    );
};

const useStylesHair = makeStyles({
    hair: {
        strokeWidth: 2,
        strokeLinecap: "round",
        stroke: COLORS["LIGHT_GRAY"],
        strokeDasharray: "5,5"
    }
});

const Hair = ({x, y}) => {
    const {xScale, yScale} = useContext(PlotContext);
    const classes = useStylesHair();
    return (
        <>
        <Line from={{x: xScale(0), y: yScale(y)}} to={{x: xScale(x), y: yScale(y)}} className={classes.hair}/>
        <Line from={{x: xScale(x), y: yScale(0)}} to={{x: xScale(x), y: yScale(y)}} className={classes.hair}/>
        </>
    );
}

export { Plot, Fx, Point, Annot, Hair };
