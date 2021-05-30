import React from 'react';
import styled from "styled-components";
import kuLeuvenLogo from "../../images/sponsor/KULEUVEN_RGB_LOGO.png";
import vivesLogo from "../../images/sponsor/VIVES.png";
import { Link } from 'gatsby-theme-material-ui';
import Grid from "@material-ui/core/Grid";


const SponsorImg = styled.img`
    width: 56mm;
`;

const SponsorWrapper = styled.div`
    break-inside: avoid;
`;


export default function Sponsors() {
    return (
        <SponsorWrapper>
        <h2>Hoe Zit Het? wordt met trots gesteund door</h2>
        <Grid container spacing={ 4 } justify="center" alignItems="center" >
          <Grid item>
            <a href="https://www.kuleuven.be/kuleuven">
                <SponsorImg src={ kuLeuvenLogo } alt="KU Leuven sponsor" />
            </a>
          </Grid>
          <Grid item>
            <a href="https://www.vives.be/">
                <SponsorImg src={ vivesLogo } alt="VIVES sponsor" />
            </a>
          </Grid>
        </Grid>
        <p>
            Wil jij ook steunen? Trakteer Hoe Zit Het? op een drankje! 🥤 Ga daarvoor naar <Link to="/trakteer">de trakteer-pagina</Link>.
        </p>
        </SponsorWrapper>
    );
}
