import React, { createContext, useState, useRef, useContext, useEffect } from 'react';
import { gsap } from "gsap";
import { Link, IconButton } from 'gatsby-theme-material-ui';
import { makeStyles } from '@material-ui/core/styles';
import SaveIcon from '@material-ui/icons/Save';
import { ParentSize } from '@visx/responsive';
import { scaleLinear } from '@visx/scale';
import { Text } from '@visx/text';

import { getColor } from "../../colors";
import { LessonContext } from "../../templates/lesson";


const useStyles = makeStyles({
    drawing: {
        display: "block",
        margin: "auto"
    },
    watermark: {
        fill: getColor("light_gray"),
        fontSize: 11,
    },
});

export const DrawingContext = createContext({width: null, height: null, xScale: null, yScale: null});

export const Drawing = ({
    children=null, aspect=1.0, maxWidth=500, top=0.05, right=0.05, bottom=0.05, left=0.05,
    xMin=0, yMin=0, xMax=100, yMax=100, watermark=true, className="",
}) => {
    // A Drawing takes the width of its parent, limited to maxWidth pixels. Its height is calculated from the width and the aspect ratio.
    const classes = useStyles();
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
                    <svg width={width} height={height} className={`${classes.drawing} drawing ${className}`}>
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

const useSaveDrawingStyles = makeStyles({
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
        color: getColor("light_gray"),
        '&:hover': {
            color: getColor("gray")
        }
    },
});

export const SaveableDrawing = (props) => {
    const [isHovering, setIsHovering] = useState(false);
    const drawingNrRef = useRef(0);
    const overlayElRef = useRef(null);
    const lessonContext = useContext(LessonContext);
    if (lessonContext && drawingNrRef.current === 0) {
        lessonContext.drawingCount = (
            lessonContext.drawingCount
            ? lessonContext.drawingCount + 1
            : 1
        );
        drawingNrRef.current = lessonContext.drawingCount;
    }

    const drawingName = `drawing_${drawingNrRef.current}`;
    const pngHref = `./${drawingName}.png`;  // This png file should be generated on deploy!
    const classes = useSaveDrawingStyles();

    useEffect(() => {
        if (isHovering) {
            gsap.to(overlayElRef.current, {
                right: "0px",
                opacity: 1,
                stagger: 0.1
            });
        } else {
            gsap.to(overlayElRef.current, {
                right: "-24px",
                opacity: 0
            });
        }
    }, [isHovering]);

    return (
        <div className={classes.wrapper} onMouseEnter={() => setIsHovering(true)} onMouseLeave={() => setIsHovering(false)}>
            <Drawing {...props}/>
            <div className={classes.overlay}>
                <IconButton aria-label="save" to={pngHref} className={classes.overlayElement} ref={overlayElRef} title="Afbeelding opslaan" download>
                    <SaveIcon />
                </IconButton>
            </div>
        </div>
    );
};