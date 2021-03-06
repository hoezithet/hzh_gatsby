import React, { createContext, useState, useRef, useContext, useEffect, useCallback } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { ParentSize } from '@visx/responsive';
import { scaleLinear } from '@visx/scale';
import { Text } from '@visx/text';

import { getColor } from "../../colors";
import { withSave } from "../withSave";


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
    xMin=0, yMin=0, xMax=100, yMax=100, watermark=true, className=""
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
                    <svg width={width} height={height} className={`${classes.drawing} drawing ${className}`} >
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


export const SaveableDrawing = withSave(Drawing, ".png");