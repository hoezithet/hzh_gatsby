import React from "react";
import { Container, Grid } from "semantic-ui-react";
import HzhIcon from "./general/HzhIcon";

import "./footer.css";

interface FooterProps {
    title: string;
    subtitle?: string;
    githubLink?: string;
    facebookLink?: string;
}

class Footer extends React.Component<FooterProps, any> {
    public static defaultProps = {
        subtitle: "",
        githubLink: undefined,
        facebookLink: undefined,
    };

    constructor(props: FooterProps) {
        super(props);
    }

    render() {
        const { title, subtitle } = this.props;
        return (
            <Container fluid textAlign="center" className="hzh-footer">
                <Grid centered>
                    <Grid.Row className="hzh-footer-title">{title}</Grid.Row>
                    {subtitle ? <Grid.Row className="hzh-footer-subtitle">{subtitle}</Grid.Row> : null}
                    <Grid.Row>
                        <Grid.Column textAlign="center">
                            {this._renderSocials()}
                            <a
                                href="https://creativecommons.org/licenses/by-nc-sa/4.0/"
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                <HzhIcon name="creative commons" />
                            </a>
                        </Grid.Column>
                    </Grid.Row>
                </Grid>
            </Container>
        );
    }

    _renderSocials = () => {
        const { facebookLink, githubLink } = this.props;
        return (
            <>
                {facebookLink ? (
                    <a href={facebookLink} target="_blank" rel="noopener noreferrer">
                        <HzhIcon name="facebook square" />
                    </a>
                ) : null}
                {githubLink ? (
                    <a href={githubLink} target="_blank" rel="noopener noreferrer">
                        <HzhIcon name="github" />
                    </a>
                ) : null}
            </>
        );
    };
}
export default Footer;
