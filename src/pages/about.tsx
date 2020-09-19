import React from "react";
import Layout from "../components/layout";
import theme from "../components/theme.";
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import Box from "@material-ui/core/Box";
import COLORS from "../colors";
import styled from "styled-components";
import demotivated from "../images/about/leerling_gedemotiveerd.png";
import bfg_watch from "../images/about/HZH_GVR_watching.png";
import bfg_run from "../images/about/HZH_GVR_run.png";
import bfg_lift from "../images/about/HZH_GVR_lifter.png";

const StyledCite = styled.cite`
    color: ${COLORS.GRAY};
`;

const AboutImg = styled.img`
    display: block;
    margin: auto;
    max-width: 100%;
    width: 75%;
`;


export default function About() {
    return (
        <Layout>
            <h1>Wie zijn we?</h1>
            <StyledCite>
                Het is zover. Morgen examen wiskunde. Ik heb al heel de namiddag en avond zitten studeren, maar het lijkt niet op te schieten. De stress neemt toe en ik begin wat paniekerig te bladeren door de cursus om te zien hoeveel ik nog moet studeren. Duidelijk meer dan verwacht. En dan heb ik eens de oefeningen nog niet gemaakt… Laat staan mijn toetsen opnieuw geprobeerd. Wat is dat toch met dat vak? Waarvoor ga ik dat trouwens ooit gebruiken? De moed zakt in mijn schoenen. Het licht gaat uit. Dit lukt nooit.
        </StyledCite>
        <AboutImg src={ demotivated } />
        <p>
            Misschien herken je het bovenstaande verhaal wel, net als veel leerlingen van het middelbaar. Bij Hoe Zit Het? zijn we <b>gepassioneerd door wiskunde en wetenschap</b>. Dat de vakken waar wij zo’n grote passie voor hebben zulke angst en paniek kunnen veroorzaken bij leerlingen, vinden we heel jammer. Het voelt alsof veel leerlingen bang zijn voor de Grote Vriendelijke Reus, maar <b>niemand hen ooit op zijn schouder heeft gezet</b>.
        </p>
        <Grid container spacing={ 2 } justify="space-between">
            <Grid item xs={ 12 } sm={ 6 }>
                <AboutImg src={ bfg_watch } />
            </Grid>
            <Grid item xs={ 12 } sm={ 6 }>
                <AboutImg src={ bfg_run } />
            </Grid>
        </Grid>
        <h2>Wetenschap verlicht 💡</h2>
        <p>
            Hoe Zit Het? wil het studeren van <b>wetenschap en wiskunde voor leerlingen verlichten</b>. We willen leerlingen op de schouder van de reus laten staan en hen tonen dat het uitzicht eigenlijk wel best mooi is. Wij willen niet dat leerstof wetenschap en wiskunde leerlingen nog langer slapeloze nachten bezorgt, maar hen een inwendig <b>vreugdesprongetje geeft bij elke nieuwe “Aha!”</b>.
        </p>
        <p>
            Wij willen leerlingen tonen dat <b>wetenschap verlicht</b>.
        </p>
        <AboutImg src={ bfg_lift } />
        <h2>Ons team</h2>
        <h2>Wil jij ook meehelpen?</h2>
    </Layout>
    );
}
