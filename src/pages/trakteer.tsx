import React from "react";
import Layout from '../components/layout';
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import Box from "@material-ui/core/Box";
import COLORS from "../colors";
import donate from "../images/trakteer/donate.png";
import styled from "styled-components";

function TrakteerButton(props) {
    return (
        <Grid item >
            <Grid container direction="column" justify="center" alignItems="center" spacing={ 1 }>
                <Grid item>
                    <Button href={ props.href } variant="contained" color="primary" size="large">
                        { props.children }
                    </Button>
                </Grid>
                <Grid item>
                    <Box color={ COLORS.GRAY } >
                        { `(${props.amount})` }
                    </Box>
                </Grid>
            </Grid>
        </Grid>
    );
}

const TrakteerImg = styled.img`
    display: block;
    margin: auto;
`

export default function Trakteer() {
    return (
        <Layout>
            <h1>🥤 Trakteer ons!</h1>
            <Box width={ { xs: 3/4, md: 1/2 } } clone>
                <TrakteerImg src={ donate } />
            </Box>
            <p>
                Onze passie voor wetenschappen en wiskunde zorgt ervoor dat we met heel veel plezier hard werken aan <b>Hoe Zit Het?</b>.
Om die passie te kunnen overbrengen naar zij die het het meeste nodig hebben, bieden we de lessen <b>voor iedereen gratis</b> aan. 🙌
            </p>
            <p>
                Wil je ons graag steunen in ons doel? Dat kan! Via onderstaande knoppen kan je ons trakteren op een symbolisch drankje! 🥤 Jouw traktatie zal integraal worden gebruikt om onze website verder uit te breiden met meer lessen, meer illustraties en meer verlichte uitleg! 💡
            </p>

            <Box my={ 4 }>
                <Grid container spacing={2} justify="center">
                    <TrakteerButton href="https://www.paypal.com/cgi-bin/webscr?cmd=_s-xclick&hosted_button_id=YZBJ7U5JFSQ8G&source=url" amount="€2">
                        🥤 Frisdrankje
                    </TrakteerButton>
                    <TrakteerButton href="https://www.paypal.com/cgi-bin/webscr?cmd=_s-xclick&hosted_button_id=NHE8CFLULN9WG&source=url" amount="€4">
                        ☕ Frappuccino
                    </TrakteerButton>
                    <TrakteerButton href="https://www.paypal.com/cgi-bin/webscr?cmd=_s-xclick&hosted_button_id=TCLFUBNZ3QUGN&source=url" amount="€10">
                        🍻 Tournée Générale!
                    </TrakteerButton>
                    <TrakteerButton href="https://www.paypal.com/cgi-bin/webscr?cmd=_s-xclick&hosted_button_id=X8BH56ZVUG2BQ&source=url" amount="Eigen bedrag">
                        Zelf iets kiezen
                    </TrakteerButton>
                </Grid>
            </Box>
        </Layout>
    );
}
