import React from 'react';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import { Theme } from '@material-ui/core/styles/createMuiTheme';
import MuiPaper from '@material-ui/core/Paper';


type StylesPropType = {
    theme: Theme
}


const useStyles = makeStyles({
    paper: {
        padding: (props: StylesPropType) => `${props.theme.spacing(2)}px`,
        margin: (props: StylesPropType) => `${props.theme.spacing(1)}px`,
        breakInside: "avoid",
    }
});

const Paper = (props: React.PropsWithChildren<any>) => {
    const theme = useTheme();
    const classes = useStyles({ theme });

    return (
        <MuiPaper className={classes.paper}>
            { props.children }
        </MuiPaper>
    );
};

export default Paper;
