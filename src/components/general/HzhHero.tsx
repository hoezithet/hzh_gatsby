import React from "react";
import { Container, Image, Grid } from "semantic-ui-react";
import HzhHeader from "./HzhHeader";
import * as CSS from "csstype";
import COLORS from "../../colors";
import "./HzhHero.css";

interface HzhHeroProps {
    image: string;
    title: string;
    text: string;
    backgroundColor?: string;
    imagePosition?: string;
    color?: string;
}

class HzhHero extends React.Component<HzhHeroProps, unknown> {
    static defaultProps: Partial<HzhHeroProps> = {
        imagePosition: "left",
        color: "#F7E5B7",
        backgroundColor: COLORS.NEAR_WHITE,
    };

    hzhHeroStyles: CSS.Properties = {
        fontFamily: "Quicksand",
        backgroundColor: this.props.backgroundColor,
        paddingTop: "2.5rem",
        paddingBottom: "2.5rem",
    };

    render() {
        const { title } = this.props;
        return (
            <Container fluid style={this.hzhHeroStyles}>
                <Grid stackable className="hzh-hero-content">
                    <Grid.Row centered>
                        <HzhHeader as="h1">{title}</HzhHeader>
                    </Grid.Row>
                    <Grid.Row columns="equal" className="hzh-left-content">
                        <Grid.Column className="hzh-hero-left">{this._renderLeftContent()}</Grid.Column>
                        <Grid.Column className="hzh-hero-right">{this._renderRightContent()}</Grid.Column>
                    </Grid.Row>
                    <div></div>
                    <div></div>
                </Grid>
            </Container>
        );
    }

    _renderLeftContent = () => {
        const { imagePosition, image, text } = this.props;
        return imagePosition === "left" ? <Image src={image} /> : <div className="hzh-hero-text">{text}</div>;
    };

    _renderRightContent = () => {
        const { imagePosition, image, text } = this.props;
        return imagePosition === "left" ? <p className="hzh-hero-text">{text}</p> : <Image src={image} />;
    };
}

export default HzhHero;
