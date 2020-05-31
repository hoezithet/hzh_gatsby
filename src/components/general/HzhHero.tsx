import React from "react";
import { Container, Image } from "semantic-ui-react";
import HzhHeader from "./HzhHeader";
import CSS from "csstype";
import COLORS from "../../colors";
import "./HzhHero.css";

interface HzhHeroProps {
    image: string;
    title: string;
    text: string;
    imagePosition?: string;
    color?: string;
}

class HzhHero extends React.Component<HzhHeroProps, unknown> {
    static defaultProps: Partial<HzhHeroProps> = {
        imagePosition: "left",
        color: "#F7E5B7",
    };

    render() {
        const { title } = this.props;
        return (
            <Container fluid>
                <div className="hzh-hero-content">
                    <HzhHeader>{title}</HzhHeader>
                    <div className="hzh-left-content">{this._renderLeftContent()}</div>
                    <div className="hzh-right-content">{this._renderRightContent()}</div>
                </div>
            </Container>
        );
    }

    _renderLeftContent = () => {
        const { imagePosition, image, text } = this.props;
        return imagePosition === "left" ? <Image src={image} /> : <p>{text}</p>;
    };

    _renderRightContent = () => {
        const { imagePosition, image, text } = this.props;
        return imagePosition === "left" ? <p>{text}</p> : <Image src={image} />;
    };
}

export default HzhHero;
