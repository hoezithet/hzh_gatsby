import React, { useContext } from 'react';
import { Line } from "./line";

export const HairLines = ({x, y, useContextScale=true}) => {
    return (
        <>
        <Line xStart={0} yStart={y} xEnd={x} yEnd={y} color="light_gray"
            lineWidth={2} useContextScale={useContextScale} dashed={true} />
        <Line xStart={x} yStart={y} xEnd={x} yEnd={0} color="light_gray"
            lineWidth={2} useContextScale={useContextScale} dashed={true} />
        </>
    );
};