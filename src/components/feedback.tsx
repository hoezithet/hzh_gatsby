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
            button: <Button variant="contained" id={ this.props.id } onClick={ this.props.onClick.bind(this) }>{ this.props.children }</Button>
        }
        this.disable = this.disable.bind(this);
    }

    disable() {
        this.state.button.disabled = true;
    }

    render() {
        return (
            <Grid container spacing={ 2 } alignItems="center" direction="column">
                <Grid item >
                    <Img fixed={ this.props.node.childImageSharp.fixed } />
                </Grid>
                <Grid item >
                    { this.state.button }
                </Grid>
            </Grid>
        );
    }
}

function getLampImgNode(imgData, img_name: string) {
    return imgData.allFile.edges.find(({ node }) => node.name === img_name).node;
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
        const buttons = btnProps.map(({imgName, id, text}) =>
            <StaticQuery query={ feedbackBtnsQuery }
            render={ imgData =>
                <FeedbackItem node={ getLampImgNode(imgData, imgName) } id={ id } onClick={ this.handleClick }>{ text }</FeedbackItem> 
            } />
        );
        
        this.state = {
            buttons: buttons
        };
    }
    
    handleClick() {
        this.state.buttons.forEach(b => b.disable())
    }
    
    render() {
        return (
            <>
                <h2>Hoe duidelijke vond je deze les?</h2>
                <Grid container spacing={ 2 }>
                    { this.state.buttons.map(b =>
                    <Grid item xs={ 4 }>
                        { b }
                    </Grid>) }
                </Grid>
            </>
        );
    }
}
