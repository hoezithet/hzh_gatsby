import { Link, Box } from '@material-ui/core';
import styled from 'styled-components';
import { muiTheme } from '../components/layout';
import COLORS from '../colors';


const BlockquoteBox = styled(Box)`
    color: ${COLORS.GRAY};
    border-left: 2px solid ${COLORS.GRAY};
    margin: ${muiTheme.spacing(4)}px;
    padding: 0 ${muiTheme.spacing(2)}px;
`;

export default BlockquoteBox;
