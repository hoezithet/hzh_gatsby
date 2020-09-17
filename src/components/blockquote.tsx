import { Link, Box } from '@material-ui/core';
import styled from 'styled-components';
import { theme } from '../components/theme';
import COLORS from '../colors';


const BlockquoteBox = styled(Box)`
    color: ${COLORS.GRAY};
    border-left: 2px solid ${COLORS.GRAY};
    margin: ${theme.spacing(4)}px;
    padding: 0 ${theme.spacing(2)}px;
`;

export default BlockquoteBox;
