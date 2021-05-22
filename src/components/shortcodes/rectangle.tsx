import React, { useContext } from 'react';

import { DrawingContext } from "./drawing";
import COLORS from "../../colors";
import { STROKE_DASHARRAY } from "./line";

export const Rectangle = ({x1, y1, x2, y2, fill=null, stroke=null, dashed=false, strokeOpacity=1, fillOpacity=1, useContextScale=true}) => {
    const {xScale, yScale} = useContext(DrawingContext);

    if (xScale && yScale && useContextScale) {
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