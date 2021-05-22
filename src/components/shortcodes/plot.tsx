import React, { useContext, useEffect, useRef, useState } from 'react';
import { Link, IconButton } from 'gatsby-theme-material-ui';
import { gsap } from "gsap";
import { makeStyles } from '@material-ui/core/styles';
import SaveIcon from '@material-ui/icons/Save';

import COLORS from "../../colors";
import { LessonContext } from "../../templates/lesson";
import { Drawing, DrawingContext } from "./drawing";
import { Axes } from "./axes";


const useStyles = makeStyles({
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
    const classes = useStyles();
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

export { Plot, SaveablePlot };
