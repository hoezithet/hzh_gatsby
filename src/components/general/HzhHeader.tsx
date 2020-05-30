import React from "react";
import { Header } from "semantic-ui-react";
import CSS from "csstype";
import COLORS from "../../colors";

interface HzhHeaderProps {
    as?: string;
    children: React.ReactNode;
}

const hzhHeaderStyles: CSS.Properties = {
    color: COLORS.MID_GRAY,
    fontFamily: "Quicksand",
};

const HzhHeader = ({ as = "h2", children }: HzhHeaderProps) => (
    <Header as={as} style={hzhHeaderStyles}>
        {children}
    </Header>
);
export default HzhHeader;
