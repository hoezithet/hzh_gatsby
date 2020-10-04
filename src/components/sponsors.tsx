import React from 'react';
import styled from "styled-components";
import kuLeuvenLogo from "../images/sponsor/KULEUVEN_RGB_LOGO.png";
import { Link } from 'gatsby-theme-material-ui';


const SponsorImg = styled.img`
    width: 56mm;
`;


export default function Sponsors() {
    return (
        <>
        <h2>Hoe Zit Het? wordt met trots gesteund door</h2>
        <a href="https://www.kuleuven.be/kuleuven">
            <SponsorImg src={ kuLeuvenLogo } alt="KU Leuven sponsor" />
        </a>
        <p>
            Wil jij ook steunen? Trakteer Hoe Zit Het? op een drankje! 🥤 Ga daarvoor naar <Link to="/trakteer">de trakteer-pagina</Link>.
        </p>
        </>
    );
}
