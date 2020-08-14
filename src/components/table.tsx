import styled from 'styled-components';
import { muiTheme } from '../components/layout';
import COLORS from '../colors';

const Table = styled.table`
    text-align: center;
    margin: auto;
    & thead {
        background-color: ${COLORS.LIGHT_GRAY};
        border: solid 1px black;
        border-collapse:separate;
    }
    & th {
        padding: 16px;
    }
    & td {
        padding: 16px;
    }
    & > tbody > tr:nth-child(odd) {
        background-color: #eee;
    }
    & > tbody > tr:nth-child(even) {
        background-color: #f1f1f1;
    }
`;

export default Table;
