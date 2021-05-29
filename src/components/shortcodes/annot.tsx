import React, { createContext, useContext, useEffect, useRef, useState } from 'react';

import { theme } from "../theme";
import { DrawingContext } from "./drawing";
import { ArrowLine } from "./arrow";
import { SvgNote } from "./svgNote";


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

export const Annot = ({
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
        <SvgNote x={xAnnot} y={yAnnot} showBackground={showBackground} backgroundColor={showBackground ? backgroundColor : "none"}
        backgroundOpacity={backgroundOpacity} hAlign={hAlign}
        vAlign={vAlign} useContextScale={false}>
            { children }
        </SvgNote>
        {
            showLine ?
            arrowLine
            : null
        }
        </>
    );
};