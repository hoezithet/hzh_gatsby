import React from "react";
import { Header } from "semantic-ui-react";
import * as CSS from "csstype";
import COLORS from "../../colors";

interface HzhHeaderProps {
    as?: string;
    children: React.ReactNode;
    style?: CSS.Properties;
}

const hzhHeaderStyles: CSS.Properties = {
    color: COLORS.MID_GRAY,
};

const HzhHeader = ({ as = "h2", style = hzhHeaderStyles, children }: HzhHeaderProps) => (
    <Header as={as} style={style}>
        {children}
    </Header>
);
export default HzhHeader;
