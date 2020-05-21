import React from "react";
import { Icon } from "semantic-ui-react";

interface HzhIconProps {
    name: string;
}

const HzhIcon = ({ name }: HzhIconProps) => <Icon size="large" color="grey" name={name} />;

export default HzhIcon;
