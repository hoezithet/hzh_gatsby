import React from "react";
import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";

export default function Feedback() {
    return (
        <>
        <h2>Hoe duidelijke vond je deze les?</h2>
        <Grid container spacing={ 2 }>
            <Grid item xs={ 4 }>
                <Button id="feedback_neg">Niet duidelijk</Button>
            </Grid>
            <Grid item xs={ 4 }>
                <Button id="feedback_neutr">Redelijk duidelijk</Button>
            </Grid>
            <Grid item xs={ 4 }>
                <Button id="feedback_pos">Heel duidelijk</Button>
            </Grid>
        </Grid>
        </>
    );
}
