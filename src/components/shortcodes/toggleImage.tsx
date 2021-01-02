import Box from "@material-ui/core/Box";
import Grid from "@material-ui/core/Grid";
import Switch from "@material-ui/core/Switch";
import React, { useState } from "react";

interface ToggleImageProps {
    children: {
        props: {
            children: (JSX.Element|string)[];
        };
    };
    toggleText: string;
}

const ToggleImage = ({children, toggleText}: ToggleImageProps) => {
    const [state, setState] = useState({ toggled: false });
    const imgs = children.props.children.filter(c => c !== "\n")
    const img1 = imgs[0];
    const img2 = imgs[1];

  const explanationSwitch = (
      <Grid xs={12} item>
          <Grid container justify="flex-end" alignItems="center">
              <Grid item>
                  <Switch color="primary" onChange={e => setState({ toggled: e.target.checked })} />
              </Grid>
              <Grid item>
                  <span>{ toggleText }</span>
              </Grid>
          </Grid>
      </Grid>
  );

  return (
    <Grid container>
      <Grid xs={ 12 } item>
        <Box margin={ "auto" }>
          { state.toggled ? img2 : img1 }
        </Box>
      </Grid>
      { explanationSwitch }
    </Grid>
  );
}

export default ToggleImage;