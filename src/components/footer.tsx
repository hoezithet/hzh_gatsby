import React from "react";
import { Grid } from "@material-ui/core";
import { GitHub, Facebook } from '@material-ui/icons';
import { Link, SvgIcon, SvgIconProps } from '@material-ui/core';
import styled from 'styled-components';
import COLORS from '../colors';

function CCIcon(props: SvgIconProps) {
    return (
        <SvgIcon {...props}>
            <path d="M 11.914733,12.666473 10.396851,11.914077 C 9.8692595,12.683378 9.4853942,13.204029 8.376603,12.900204 7.5062554,12.661714 7.2486412,11.70779 7.2155567,10.907598 7.170368,9.8146069 7.5524859,8.5522654 8.8579275,8.6197719 9.6921011,8.6628975 10.047527,9.1548803 10.237469,9.597143 L 11.89479,8.7475366 C 11.078439,7.1901011 9.1653439,6.6604307 7.5436888,7.094456 5.8181101,7.5562991 4.9441126,9.1436673 4.9747552,10.855571 c 0.031327,1.749902 0.8713278,3.261522 2.6757501,3.65604 0.8798087,0.192358 1.837797,0.147645 2.6525207,-0.260849 0.630515,-0.316136 1.331024,-0.926309 1.611707,-1.584294 z m 7.155202,0 -1.517882,-0.752396 c -0.527592,0.769301 -0.911457,1.289952 -2.020248,0.986127 -0.870348,-0.23849 -1.127967,-1.192414 -1.161046,-1.992606 -0.04519,-1.0929911 0.336929,-2.3553326 1.64237,-2.2878261 0.834174,0.043126 1.189594,0.5351084 1.379541,0.9773711 L 19.049992,8.7475366 C 18.23364,7.1901011 16.320541,6.6604307 14.69889,7.094456 c -1.725578,0.4618431 -2.599576,2.0492113 -2.568933,3.761115 0.03132,1.749902 0.871328,3.261522 2.67575,3.65604 0.879809,0.192358 1.837797,0.147645 2.652521,-0.260849 0.630514,-0.316136 1.331024,-0.926309 1.611707,-1.584294 z M 12.029439,5.357436 c 1.526498,-1.6530961 3.30949,-2.4048649 5.373937,-2.1136276 2.130802,0.3006101 3.945012,1.8239453 4.590005,3.8771222 0.496312,1.579867 0.290284,3.3492974 -0.374331,4.9628294 -1.033681,2.509561 -4.088267,6.076737 -9.619046,8.570637 C 6.4692313,18.160497 3.4146446,14.593321 2.3809593,12.08376 1.7163439,10.470228 1.5103212,8.7007976 2.0066275,7.1209306 2.6516162,5.0677537 4.465831,3.5444185 6.5966334,3.2438084 8.6611423,2.9525607 10.444171,3.7043865 11.970705,5.3575759 c 0.0028,0.00303 0.0293,0.031814 0.0293,0.031809 2e-5,2.08e-5 0.02691,-0.029217 0.02944,-0.031949 z M 11.999999,3.013001 C 8.665808,0.39611024 3.4400411,1.078937 1.0370475,5.0119223 0.23918773,6.3177885 -0.06047885,7.8360384 0.00994067,9.3433912 0.13209656,11.957991 1.2607114,14.243452 2.9184835,16.215712 c 2.2322429,2.655714 5.4594104,4.742634 9.0109465,6.299976 0.0049,0.0022 0.04594,0.01999 0.07057,0.03094 0.0216,-0.0091 0.05941,-0.02613 0.07103,-0.03126 3.533237,-1.557311 6.778377,-3.644418 9.01049,-6.299665 1.657886,-1.972166 2.786387,-4.257727 2.908543,-6.8723209 C 24.060483,7.8360329 23.760821,6.3177783 22.962951,5.0119168 20.559957,1.0789318 15.334196,0.39610506 11.999999,3.0129958 Z" />
        </SvgIcon>
    );
}

const IconLink = styled(Link)`
    color: ${COLORS.GRAY};
`
IconLink.defaultProps = {
    target: "_blank",
    rel: "noopener noreferrer",
}

interface FooterProps {
    title: string;
    subtitle: string;
    githubLink: string;
    facebookLink: string;
    ccLink: string;
}

const FooterGrid = styled(Grid)`
`;

FooterGrid.defaultProps = {
    container: true,
    spacing: 0,
    justify: "space-between",
    direction: "column",
    alignItems: "center",
};

const FooterItem = styled(Grid)`
    text-align: center;
    color: ${COLORS.GRAY};
`

FooterItem.defaultProps = {
    item: true,
};

const FooterTitle = styled(FooterItem)`
    font-weight: bold;
`;

const FooterIcon = styled(FooterItem)``;
FooterIcon.defaultProps = {
    xs: 1,
}

const Footer = ({ title, subtitle, ccLink, githubLink, facebookLink }: FooterProps) => {
    return (
        <FooterGrid>
            <FooterTitle>
                {title}
            </FooterTitle>
            <FooterItem>
                {subtitle}
            </FooterItem>
        <Grid container justify="center" >
            <FooterIcon>
                <IconLink href={ccLink}>
                    <CCIcon/>
                </IconLink>
            </FooterIcon>
            <FooterIcon>
                <IconLink href={facebookLink}>
                    <Facebook/>
                </IconLink>
            </FooterIcon>
            <FooterIcon>
                <IconLink href={githubLink}>
                    <GitHub/>
                </IconLink>
            </FooterIcon>
        </Grid>
        </FooterGrid>
    );
}

export default Footer;