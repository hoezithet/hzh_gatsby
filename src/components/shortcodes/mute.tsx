import React from "react";

interface MuteProps {
    text: string;
}

const Mute = ({ text }: MuteProps) => (
    <span style={{ color: `lightgray`}}>
        {text}
    </span>
);

export default Mute;
