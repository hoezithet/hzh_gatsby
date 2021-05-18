import React, { createContext, useContext, useEffect, useRef, useState } from 'react';
import { Link, IconButton } from 'gatsby-theme-material-ui';
import { gsap } from "gsap";
import { makeStyles } from '@material-ui/core/styles';
import SaveIcon from '@material-ui/icons/Save';
import { scaleLinear } from '@visx/scale';
import { Group } from '@visx/group';
import { AxisBottom, AxisLeft } from '@visx/axis';
import { Line, LinePath, Circle } from '@visx/shape';
import { ParentSize } from '@visx/responsive';
import { Text } from '@visx/text';
import { curveLinear } from '@visx/curve';

import { theme } from "../theme";
import COLORS, { hexToRGB } from "../../colors";
import { LessonContext } from "../../templates/lesson";


const ARROW = "m8.7186 4.0337-10.926-4.0177 10.926-4.0177c-1.7455 2.3721-1.7354 5.6175-6e-7 8.0354z";
const [ARROW_WIDTH, ARROW_HEIGHT] = [12.35, 9.46667];

const STROKE_DASHARRAY = "4";

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

const useStylesDrawing = makeStyles({
    drawing: {
        display: "block",
        margin: "auto"
    },
    watermark: {
        fill: COLORS.LIGHT_GRAY,
        fontSize: 11,
    },
});
const DrawingContext = createContext({width: null, height: null, xScale: null, yScale: null});

const Drawing = ({children=null, aspect=1.0, maxWidth=500, top=0.05, right=0.05, bottom=0.05, left=0.05, xMin=0, yMin=0, xMax=100, yMax=100, watermark=true}) => {
    // A Drawing takes the width of its parent, limited to maxWidth pixels. Its height is calculated from the width and the aspect ratio.
    const classes = useStylesDrawing();
    return (
        <ParentSize>
        { ({width}) => {
            width = Math.min(width, maxWidth);
            const height = width/aspect;
            const xScale = scaleLinear({
                range: [width*left, width*(1 - right)],
                domain: [xMin, xMax],
                round: false
            });

            const yScale = scaleLinear({
                range: [height*(1 - bottom), height*top],
                domain: [yMin, yMax],
                round: false
            });

            return (
                <DrawingContext.Provider value={{width: width, height: height, xScale: xScale, yScale: yScale}}>
                    <svg width={width} height={height} className={`${classes.drawing} drawing`}>
                        { watermark ?
                          <Text x={width - 10} y={height - 10} textAnchor="end" className={classes.watermark}>
                              Meer op: https://hoezithet.nu
                          </Text>
                          : null }
                        { children }
                    </svg>
                </DrawingContext.Provider>
            );
          }
        }
        </ParentSize>
    ); 
};

const Axes = ({
    children=null,
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

    const {xScale, yScale, width, height} = useContext(DrawingContext);
    const [xMin, xMax] = xScale.domain();
    const [yMin, yMax] = yScale.domain();
    xAxisMargin = xAxisMargin*width;
    yAxisMargin = yAxisMargin*height;
    
    const classes = useStyles({
        xFontSize: xFontSize,
        yFontSize: yFontSize,
        xColor: xColor,
        yColor: yColor,
    });
    
    return (
        <>
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
            { children }
        </>
    );
}

const useStylesPlot = makeStyles({
    plot: {
        display: "block",
        margin: "auto"
    },
});

const Plot = ({
    children=null,
    aspect=1.0,
    top=0.05, right=0.05, bottom=0.05, left=0.05,
    xMin=-10, yMin=-10, xMax=10, yMax=10,
    xTicks=10, yTicks=10,
    xLabel="x", yLabel="y",
    xTickFormat=(d, i) => d, yTickFormat=(d, i) => d,
    xColor="gray", yColor="gray",
    xFontSize=14, yFontSize=14,
    xAxisMargin=0.05, yAxisMargin=0.05,
    maxWidth=500
}) => {
    // Wrapper class for Drawing + Axes
    const classes = useStylesPlot();
    return (
        <Drawing maxWidth={maxWidth} aspect={aspect}
            left={left + xAxisMargin} right={right + xAxisMargin} top={top + yAxisMargin} bottom={bottom + yAxisMargin}
            xMin={xMin} yMin={yMin} xMax={xMax} yMax={yMax}
            className={`${classes.plot} plot`}>
            <Axes xTicks={xTicks} yTicks={yTicks}
                xLabel={xLabel} yLabel={yLabel}
                xTickFormat={xTickFormat} yTickFormat={yTickFormat}
                xColor={COLORS[xColor.toUpperCase()]} yColor={COLORS[yColor.toUpperCase()]}
                xFontSize={xFontSize} yFontSize={yFontSize}
                xAxisMargin={xAxisMargin} yAxisMargin={yAxisMargin}>
                {children} 
            </Axes>
        </Drawing>
    );
};

const useSavePlotStyles = makeStyles({
    wrapper: {
        position: "relative",
        width: "100%",
    },
    overlay: {
        position: "absolute",
        top: "0px",
        right: "0px",
        display: "flex",
        flexDirection: "column",
    },
    overlayElement: {
        opacity: 0,
        padding: 0,
        color: COLORS.LIGHT_GRAY,
        '&:hover': {
            color: COLORS.GRAY
        }
    },
});

const SaveablePlot = (props) => {
    const [isHovering, setIsHovering] = useState(false);
    const plotNrRef = useRef(0);
    const lessonContext = useContext(LessonContext);
    if (lessonContext && plotNrRef.current === 0) {
        lessonContext.plotCount = (
            lessonContext.plotCount
            ? lessonContext.plotCount + 1
            : 1
        );
        plotNrRef.current = lessonContext.plotCount;
    }

    const plotName = `plot_${plotNrRef.current}`;
    const pngHref = `./${plotName}.png`;  // This png file should be generated on deploy!
    const classes = useSavePlotStyles();

    useEffect(() => {
        if (isHovering) {
            gsap.to(`.${classes.overlayElement}`, {
                right: "0px",
                opacity: 1,
                stagger: 0.1
            });
        } else {
            gsap.to(`.${classes.overlayElement}`, {
                right: "-24px",
                opacity: 0
            }); 
        }
    }, [isHovering]);

    return (
        <div className={classes.wrapper} onMouseEnter={() => setIsHovering(true)} onMouseLeave={() => setIsHovering(false)}>
            <Plot {...props}/>
            <div className={classes.overlay}>
                <IconButton aria-label="save" to={pngHref} className={classes.overlayElement} title="Afbeelding opslaan" download>
                    <SaveIcon />
                </IconButton>
            </div>
        </div>
    );
};

const useStylesFx = makeStyles({
    fx: {
        fill: "none",
        stroke: props => props.color, 
        strokeWidth: props => props.lineWidth,
        strokeLinecap: "round",
        strokeLinejoin: "round",
        strokeOpacity: props => props.opacity,
        shapeRendering: "geometricPrecision",
    }
});

const Fx = ({fx, nSamples=null, xStart=null, xEnd=null, color="blue", opacity=1, lineWidth=3}) => {
    const classes = useStylesFx({color: COLORS[color.toUpperCase()], lineWidth: lineWidth, opacity: opacity});
    const {xScale, yScale} = useContext(DrawingContext);
    const [xMin, xMax] = xScale.domain();
    xStart = xStart === null ? xMin : xStart;
    xEnd = xEnd === null ? xMax : xEnd;
    nSamples = nSamples ? Math.round(nSamples) : Math.round(xScale(xEnd) - xScale(xStart));
    const xs = [...Array(nSamples + 1).keys()].map((x, i) => x*(xEnd - xStart)/nSamples + xStart).filter(x => !isNaN(fx(x)));
    return (
        <LinePath data={xs} x={x => xScale(x)} y={x => yScale(fx(x))} curve={curveLinear} className={classes.fx}/>
    );
};

const Point = ({x, y, color="blue", size=3}) => {
    const classes = useStylesFx({color: COLORS[color.toUpperCase()], lineWidth: size});
    const {xScale, yScale} = useContext(DrawingContext);
    return <Line from={{x: xScale(x), y: yScale(y)}} to={{x: xScale(x), y: yScale(y)}} className={classes.fx}/>
};

const _Line = ({xStart, yStart, xEnd, yEnd, color="blue", lineWidth=3}) => {
    const classes = useStylesFx({color: COLORS[color.toUpperCase()], lineWidth: lineWidth});
    const {xScale, yScale} = useContext(DrawingContext);
    if (xScale) {
        [xStart, xEnd] = [xStart, xEnd].map(xScale);
    }
    if (yScale) {
        [yStart, yEnd] = [yStart, yEnd].map(yScale);
    }
    return <Line from={{x: xStart, y: yStart}} to={{x: xEnd, y: yEnd}} className={classes.fx}/>
};

const sign = x => x >= 0 ? 1 : -1;  // We defign sign(0) = 1 to avoid a collapse when e.g. dx = 0
const toRad = a => (a / 180) * Math.PI;
const toDeg = a => (a * 180) / Math.PI; 

const ArrowLine = ({
    xStart, yStart, xEnd, yEnd, margin=0,
    anchorAngleEnd=null, anchorRadiusEnd=0,
    anchorAngleStart=null, anchorRadiusStart=0,
    lineColor="light_gray", lineWidth=2, dashed=false, showArrow=true,
    opacity=1, useContextScale=true,
}) => {
    const {xScale, yScale} = useContext(DrawingContext);

    if (xScale && yScale && useContextScale) {
        [xEnd, xStart] = [xEnd, xStart].map(xScale);
        [yEnd, yStart] = [yEnd, yStart].map(yScale);
    }
    
    const [dx, dy] = [xEnd - xStart, yEnd - yStart];
    const eps = 0.0001;
    
    if (anchorAngleStart === null) {
        anchorAngleStart = Math.atan(dy/(dx + eps));
        anchorAngleStart = dx < 0 ? Math.PI + anchorAngleStart : anchorAngleStart;
        anchorRadiusStart = 0;
    } else {
        anchorAngleStart = - toRad(anchorAngleStart);
    }
    if (anchorAngleEnd === null) {
        anchorAngleEnd = -Math.atan(dy/(dx + eps));
        anchorAngleEnd = dx > 0 ? Math.PI + anchorAngleEnd : anchorAngleEnd;
        anchorRadiusEnd = 0;
    } else {
        anchorAngleEnd = - toRad(anchorAngleEnd);
    }
    let [xEndLine, yEndLine, xStartLine, yStartLine] = [
        xEnd + margin * Math.cos(anchorAngleEnd),
        yEnd + margin * Math.sin(anchorAngleEnd),
        xStart + margin * Math.cos(anchorAngleStart),
        yStart + margin * Math.sin(anchorAngleStart),
    ];
    let [xEndAnch, yEndAnch, xStartAnch, yStartAnch] = [
        xEndLine + anchorRadiusEnd * Math.cos(anchorAngleEnd),
        yEndLine + anchorRadiusEnd * Math.sin(anchorAngleEnd),
        xStartLine + anchorRadiusStart * Math.cos(anchorAngleStart),
        yStartLine + anchorRadiusStart * Math.sin(anchorAngleStart),
    ];

    let arrowX, arrowY, arrowAngle, arrowScale;

    if (showArrow) {
        [arrowX, arrowY] = [xEndLine, yEndLine];
        arrowAngle = toDeg(anchorAngleEnd);
        arrowScale = lineWidth / 2.5;
        [xEndLine, xEndAnch] = [xEndLine, xEndAnch].map(
            x => x + 2/3 * ARROW_WIDTH * arrowScale * Math.cos(anchorAngleEnd),
        );
        [yEndLine, yEndAnch] = [yEndLine, yEndAnch].map(
            y => y + 2/3 * ARROW_WIDTH * arrowScale * Math.sin(anchorAngleEnd),
        );
    }
    const color = COLORS[lineColor.toUpperCase()];
    return (
    <>
        <path d={`M ${xEndLine} ${yEndLine} C ${xEndAnch} ${yEndAnch}, ${xStartAnch} ${yStartAnch}, ${xStartLine} ${yStartLine}`}
            stroke={color} fill="#00000000" strokeDasharray={dashed ? STROKE_DASHARRAY : "none"}
            strokeLinecap="round" strokeWidth={lineWidth} strokeOpacity={opacity}
            />
        { showArrow ?
            <path fill={color} stroke={color} strokeLinejoin="round" strokeOpacity={opacity} fillOpacity={opacity}
                transform={`translate(${arrowX}, ${arrowY}) rotate(${arrowAngle}) scale(${arrowScale})`} d={ARROW}/>
            : null }
    </>
    );
};

const Rectangle = ({x1, y1, x2, y2, fill=null, stroke=null, dashed=false, strokeOpacity=1, fillOpacity=1}) => {
    const {xScale, yScale} = useContext(DrawingContext);

    if (xScale && yScale) {
        [x1, x2] = [x1, x2].map(xScale);
        [y1, y2] = [y1, y2].map(yScale);
    }
    fill = fill ? COLORS[fill.toUpperCase()] : "none";
    stroke = stroke ? COLORS[stroke.toUpperCase()] : "none";
    
    return (
        <path d={`M ${x1} ${y1} H ${x2} V ${y2} H ${x1} Z`}
        fill={fill} stroke={stroke} strokeDasharray={dashed ? STROKE_DASHARRAY : "none"}
        strokeOpacity={strokeOpacity} fillOpacity={fillOpacity} />
    );
};

const useStylesNote = makeStyles({
    divNoteChild: {
        '& p': {
            margin: "0",  // Remove paragraph margin
        },
        backgroundColor: props => props.showBackground ? props.backgroundColor : "none",
        borderRadius: `${theme.spacing(0.5)}px`,
        padding: props => props.showBackground ? `${theme.spacing(1)}px` : "0",
    }
});

const calcAnchorAngleAnnot = (dx, dy) => {
    if (Math.abs(dx) >= Math.abs(dy)) {
        // If moved more horizontally than vertically, put line on left/right
        return dx >= 0 ? 0 : 180;
    } else {
        // Else, put line on top/bottom
        return dy >= 0 ? -90 : 90;
    }
};

const calcAnchorAngleTarget = (dx, dy) => {
    if (dx >= 0 && dy >=0) {
        // Target is on bottom right of annot
        return 135;
    } else if (dx >= 0 && dy < 0) {
        // Target is on top right of annot
        return -135;
    } else if (dx < 0 && dy >= 0) {
        // Target is on bottom left of annot
        return 45;
    } else {
        // Target is on top left of annot
        return -45;
    }
};

const canonicalAngle = (angle) => {
    // Return equivalent angle between ]-180; 180]
    const posAngle = ((angle % 360) + 360) % 360;
    return (posAngle > 180 ?
        posAngle - 360
        : posAngle
    )
}

const Note = ({x, y, backgroundColor="light_gray", backgroundOpacity=1, showBackground=true, hAlign="center",
    vAlign="center", useContextScale=true, children}) => {
    const {xScale, yScale, width, height} = useContext(DrawingContext);

    if (xScale && yScale && useContextScale) {
        x = xScale(x);
        y = yScale(y);
    }

    const [justifyContent, alignItems] = [
        hAlign === "right" ? 
        "flex-end"  // Right
        : (
            hAlign === "left" ?
            "flex-start"  // Left
            : "center"
        ),
        vAlign === "bottom" ? 
        "flex-end"  // Bottom
        : (
            vAlign === "top" ?
            "flex-start"  // Top
            : "center"
        ),
    ];

    [x, y] = [
        hAlign === "center" ?
        x - width/2
        : (
            hAlign === "right" ?
            x - width
            : x
        ),
        vAlign === "center" ?
        y - height/2
        : (
            vAlign === "bottom" ?
            y - height
            : y
        ),
    ];


    const backgroundColorUC = backgroundColor.toUpperCase();
    backgroundColor = backgroundColorUC in COLORS ? COLORS[backgroundColorUC] : backgroundColor;
    backgroundColor = hexToRGB(backgroundColor, backgroundOpacity);

    const classes = useStylesNote({
        justifyContent: justifyContent, alignItems: alignItems,
        backgroundColor: backgroundColor,
        backgroundOpacity: backgroundOpacity,
        showBackground: showBackground
    }); 

    const divParentStyle = {
        height: "100%",
        width: "100%",
        display: "flex",
        alignItems: alignItems,
        justifyContent: justifyContent
    };

    return (
        <foreignObject x={x} y={y} width={`${width}`} height={`${height}`}>
            <div xmlns="http://www.w3.org/1999/xhtml" style={divParentStyle}>
                <div className={classes.divNoteChild}>
                    { children }
                </div>
            </div>
        </foreignObject>
    );
}

const Annot = ({
    xAnnot, yAnnot, xTarget, yTarget, margin=theme.spacing(1),
    anchorAngleTarget=null, anchorRadiusTarget=20,
    anchorAngleAnnot=null, anchorRadiusAnnot=20,
    lineColor="light_gray", lineOpacity=1, lineWidth=2,
    showArrow=true, showLine=true, dashed=false, showBackground=false,
    backgroundColor="light_gray", backgroundOpacity=0.5, children
}) => {
    const {xScale, yScale} = useContext(DrawingContext);

    if (xScale && yScale) {
        [xTarget, xAnnot] = [xTarget, xAnnot].map(xScale);
        [yTarget, yAnnot] = [yTarget, yAnnot].map(yScale);
    }

    const [dx, dy] = [xTarget - xAnnot, yTarget - yAnnot];
    anchorAngleTarget = canonicalAngle(anchorAngleTarget === null ? calcAnchorAngleTarget(dx, dy) : anchorAngleTarget);
    anchorAngleAnnot = canonicalAngle(anchorAngleAnnot === null ? calcAnchorAngleAnnot(dx, dy) : anchorAngleAnnot);

    const arrowLine = <ArrowLine xStart={xAnnot} yStart={yAnnot} xEnd={xTarget} yEnd={yTarget}
            margin={margin}
            anchorAngleStart={anchorAngleAnnot} anchorRadiusStart={anchorRadiusAnnot}
            anchorAngleEnd={anchorAngleTarget} anchorRadiusEnd={anchorRadiusTarget}
            lineColor={lineColor} lineWidth={lineWidth} dashed={dashed} showArrow={showArrow}
            opacity={lineOpacity} useContextScale={false} />;

    let hAlign, vAlign;
    if (anchorAngleAnnot >= -45 && anchorAngleAnnot < 45) {
        [hAlign, vAlign] = ["right", "center"];
    } else if (anchorAngleAnnot >= 45 && anchorAngleAnnot < 135) {
        [hAlign, vAlign] = ["center", "top"];
    } else if (anchorAngleAnnot >= -135 && anchorAngleAnnot < -45) {
        [hAlign, vAlign] = ["center", "bottom"];
    } else if (anchorAngleAnnot >= 135 || anchorAngleAnnot < -135) {
        [hAlign, vAlign] = ["left", "center"];
    }

    return (
        <>
        <Note x={xAnnot} y={yAnnot} showBackground={showBackground} backgroundColor={showBackground ? backgroundColor : "none"}
        backgroundOpacity={backgroundOpacity} hAlign={hAlign}
        vAlign={vAlign} useContextScale={false}>
            { children }
        </Note>
        {
            showLine ?
            arrowLine
            : null
        }
        </>
    );
};

const useStylesHairLines = makeStyles({
    hair: {
        strokeWidth: 2,
        strokeLinecap: "round",
        stroke: COLORS["LIGHT_GRAY"],
        strokeDasharray: STROKE_DASHARRAY
    }
});

const HairLines = ({x, y}) => {
    const {xScale, yScale} = useContext(DrawingContext);
    const classes = useStylesHairLines();
    return (
        <>
        <Line from={{x: xScale(0), y: yScale(y)}} to={{x: xScale(x), y: yScale(y)}} className={classes.hair}/>
        <Line from={{x: xScale(x), y: yScale(0)}} to={{x: xScale(x), y: yScale(y)}} className={classes.hair}/>
        </>
    );
}

export { Drawing, Plot, SaveablePlot, Fx, Point, Annot, HairLines, _Line as Line, ArrowLine, Rectangle, Note };
