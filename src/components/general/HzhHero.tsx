import React from "react";
import { Container, Image } from "semantic-ui-react";
import HzhHeader from "./HzhHeader";

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
        const { title, image, text } = this.props;
        return (
            <Container fluid>
                <HzhHeader>{title}</HzhHeader>
                <Image src={image} />
                <p>{text}</p>
            </Container>
        );
    }
}

export default HzhHero;
