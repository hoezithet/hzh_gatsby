import React from "react";
import { graphql, StaticQuery } from "gatsby";
import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";
import Img from "gatsby-image";

const feedbackBtnsQuery = graphql`
{
  allFile(filter: {absolutePath: {glob: "**/images/feedback/lamp_*.png"}}) {
    edges {
      node {
        childImageSharp {
          fixed(height: 75) {
            ...GatsbyImageSharpFixed_tracedSVG
          }
        }
        name
      }
    }
  }
}
`;

class FeedbackItem extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            disabled: false
        }
        this.disable = this.disable.bind(this);
    }
    
    disable() {
        this.setState({ disabled: true});
    }

    render() {
        return (
            <StaticQuery query={ feedbackBtnsQuery }
            render={ imgData => {
                const node = imgData.allFile.edges.find(({ node }) => node.name === this.props.imgName).node;
                return (
                    <Grid container spacing={ 2 } alignItems="center" direction="column">
                        <Grid item >
                            <Img fixed={ node.childImageSharp.fixed } />
                        </Grid>
                        <Grid item >
                            <Button variant="contained" id={ this.props.id } onClick={ this.props.onClick.bind(this) } disabled={ this.state.disabled }>{ this.props.children }</Button>
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
        this.handleClick = this.handleClick.bind(this);
        const btnProps = [
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

        const fbItems = btnProps.map(({imgName, id, text}) =>
            <FeedbackItem imgName={ imgName } id={ id } onClick={ this.handleClick }>{ text }</FeedbackItem>
        );
        
        this.state = {
            feedbackItems: fbItems,
        };
    }
    
    handleClick() {
        this.state.feedbackItems.forEach(i => i.disable())
    }

    render() {
        return (
            <>
                <h2>Hoe duidelijke vond je deze les?</h2>
                <Grid container spacing={ 2 }>
                    { this.state.feedbackItems.map(b =>
                    <Grid item xs={ 4 }>
                        { b }
                    </Grid>) }
                </Grid>
            </>
        );
    }
}
