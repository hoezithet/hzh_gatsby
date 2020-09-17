import React from 'react';
import HzhTheme from '../components/theme';
import HzhAppBar from '../components/appbar';
import Sponsors from '../components/sponsors';
import Footer from '../components/footer';
import COLORS from '../colors.js';
import landingImg from "../images/landing/landing_large.png";
import archer from "../images/landing/archer.png";
import free from "../images/landing/free.png";
import guts from "../images/landing/guts.png";
import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import styled from "styled-components";

const LandingImg = styled.img`
    margin: auto;
    width: 100%;
`

const WhyHzhTitle = styled.h2`
    font-size: 36pt;
    font-weight: normal;
    margin: 2rem;
`

const WhyHzhTitleSpan = styled.span`
    white-space: nowrap;
    font-weight: bold;
`

const WhyHzhItemImgBox = styled(Box)`
    border: .25rem solid ${COLORS.GOLD};
    border-radius: 1rem;
    height: 8rem;
    width: 8rem;
    padding: 1rem;
    margin: auto;
    background-color: ${COLORS.NEAR_WHITE};
`

const WhyHzhItemImg = styled.img`
    height: 100%;
`;

const WhyHzhItemText = styled.p`
    width: 90%;
`;

const WhyHzhTriangle = styled.div`
    width: 0;
    height: 0;
    border-top-width: 2rem;
    border-right-width: 3rem;
    border-left-width: 3rem;
    border-style: solid;
    border-color: ${COLORS.NEAR_WHITE} transparent transparent transparent;
    margin: auto;
    margin-bottom: 1rem;
`;

const WhyHzhBox = styled(Box)`
    background-color: rgba(255, 183, 0, 0.25)
`;

const WhyHzhGrid = styled(Grid)`
    margin: auto;
`;

const ShowLessonButton = styled(Button)`
    color: ${COLORS.NEAR_WHITE};
    font-weight: bold;
    font-size: 18pt;
`;

function WhyHzhItem(props) {
    return (
        <Grid item xs={ 8 } sm={ 4 } md={ 3 }>
            <WhyHzhItemImgBox>
                <WhyHzhItemImg src={ props.img } />
            </WhyHzhItemImgBox>
            <Box>
                <h2>{ props.title }</h2>
                <WhyHzhItemText>
                    { props.children }
                </WhyHzhItemText>
            </Box>
        </Grid>
    );
}

export default function Landing() {
    return (
        <HzhTheme>
            <HzhAppBar />
            <Box px={2} py={4} display="flex" justifyContent="center" >
                <a href="/lessen/fysica/krachten_1/intro/">
                    <LandingImg src={landingImg} />
                </a>
            </Box>
            <Box id="why" textAlign="center" justifyContent="center">
                <WhyHzhTitle>Waarom <WhyHzhTitleSpan>Hoe Zit Het?</WhyHzhTitleSpan></WhyHzhTitle>
                <WhyHzhBox pb={6} >
                    <a href="#why">
                        <WhyHzhTriangle />
                    </a>
                    <WhyHzhGrid container spacing={2} justify="center" >
                        <WhyHzhItem title="Doelgericht" img={ archer }>
                            Elke les is gericht op één onderwerp. Zo kan je gaatjes in je kennis snel opvullen, zonder omwegen. 
                        </WhyHzhItem>
                        <WhyHzhItem title="Verteerbaar" img={ guts }>
                            Niemand houdt van saai. Daarom bestaan onze lessen steeds uit een heldere uitleg met veel illustraties. Zo helpen we je om alles in een handomdraai te begrijpen.
                        </WhyHzhItem>
                        <WhyHzhItem title="Gratis" img={ free }>
                            Omdat iedereen recht heeft op kennis, zijn alle lessen gratis. Voor vandaag. Voor morgen. Voor altijd.
                        </WhyHzhItem>
                    </WhyHzhGrid>
                    <ShowLessonButton variant="contained" color="primary" size="large" href="/lessen/fysica/krachten_1/intro/">
                        Toon mij een voorbeeld!
                    </ShowLessonButton>
                </WhyHzhBox>
                <Sponsors />
            </Box>
            <Footer />
        </HzhTheme>
    );
};
