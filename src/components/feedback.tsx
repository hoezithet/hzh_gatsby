import React from "react";
import { graphql, StaticQuery } from "gatsby";
import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";
import { GatsbyImage } from "gatsby-plugin-image";
import styled from "styled-components";

const feedbackBtnsQuery = graphql`{
  allFile(filter: {absolutePath: {glob: "**/images/feedback/lamp_*.png"}}) {
    edges {
      node {
        childImageSharp {
          gatsbyImageData(height: 75, placeholder: TRACED_SVG, layout: FIXED)
        }
        name
      }
    }
  }
}
`;

class FeedbackItem extends React.Component {
    render() {
        const UnselectedImg = styled(GatsbyImage)`
            opacity: 0.3
        `;
        const ImgComp = (this.props.selected || !this.props.disabled) ? GatsbyImage : UnselectedImg;
        return (
            <StaticQuery query={ feedbackBtnsQuery }
            render={ imgData => {
                const node = imgData.allFile.edges.find(({ node }) => node.name === this.props.imgName).node;
                return (
                    <Grid container spacing={ 2 } alignItems="center" direction="column">
                        <Grid item >
                            <ImgComp fixed={ node.childImageSharp.gatsbyImageData } />
                        </Grid>
                        <Grid item >
                            <Button variant="contained" id={ this.props.id } onClick={ this.props.onClick } color="primary" disabled={ this.props.disabled }>{ this.props.children }</Button>
                        </Grid>
                    </Grid>
                );
            }
            } />
        );
    }
}

export default class Feedback extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedOption: null
        };
    }

    render() {
        const fbItemProps = [
            {
                imgName: "lamp_broken",
                id: "feedback_neg",
                text: "Niet duidelijk",
            },
            {
                imgName: "lamp_off",
                id: "feedback_neutr",
                text: "Redelijk duidelijk",
            },
            {
                imgName: "lamp_on",
                id: "feedback_pos",
                text: "Heel duidelijk",
            },
        ];
        return (
            <>
                <h2>Hoe duidelijke vond je deze les?</h2>
                <Grid container spacing={ 2 }>
                    {
                        this.state.selectedOption === null ?
                        null
                        :
                        <Grid item xs={ 12 }>
                            <Grid container justify="center">
                                <Grid item >
                                    Bedankt voor je feedback!
                                </Grid>
                            </Grid>
                        </Grid>
                    }
                    { fbItemProps.map(({imgName, id, text}, idx) =>
                        <Grid item xs={ 4 } key={ id }>
                            <FeedbackItem imgName={ imgName } id={ id } onClick={ () => this.setState({selectedOption: idx}) } disabled={ this.state.selectedOption !== null }
                             selected={ this.state.selectedOption === idx }>
                               { text }
                            </FeedbackItem>
                        </Grid>
                       )
                    }
                </Grid>
            </>
        );
    }
}
