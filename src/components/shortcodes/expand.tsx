import React from "react";
import styled from 'styled-components';
import Accordion from '@material-ui/core/Accordion';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Typography from '@material-ui/core/Typography';
import PropTypes from "prop-types";
import COLORS from "../../colors";

interface ExpandProps {
    children: React.ReactNode;
    title: string;
}

const ExpandFrame = styled(Accordion)`
    border-style: solid;
    border-color: ${COLORS.GRAY};
    border-radius: 10px;
    background-color: ${COLORS.NEAR_WHITE};
    margin: 10px 0px;
`

const ExpandTitle = styled(AccordionSummary)`
    font-weight: bold;
    color: ${COLORS.DARK_GRAY};
`

const ExpandIcon = styled(ExpandMoreIcon)`
    color: ${COLORS.DARK_GRAY};
`

const ExpandBody = styled(AccordionDetails)`
    display: block;
`

const Expand = ({ children, title }: ExpandProps) => (
	<ExpandFrame>
		<ExpandTitle expandIcon={<ExpandIcon/>}>
			{ title }
		</ExpandTitle>
		<ExpandBody>
			{ children }
		</ExpandBody>
	</ExpandFrame>
);

export { Expand };