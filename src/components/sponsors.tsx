import React from 'react';
import styled from "styled-components";
import kuLeuvenLogo from "../images/sponsor/KULEUVEN_RGB_LOGO.png";

const SponsorImg = styled.img`
    width: 56mm;
`;


export default function Sponsors() {
    return (
        <>
        <h2>Wij worden met trots gesteund door</h2>
        <a href="https://www.kuleuven.be/kuleuven">
            <SponsorImg src={ kuLeuvenLogo } alt="KU Leuven sponsor" />
        </a>
        <p>
            Wil jij ons ook steunen? Trakteer ons op een drankje! Ga daarvoor naar <a href="/trakteer">onze trakteer-pagina</a>.
        </p>
        </>
    );
}
