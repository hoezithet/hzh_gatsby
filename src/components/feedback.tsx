import React, { useState } from "react";
import { graphql, useStaticQuery } from "gatsby";
import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";
import { GatsbyImage, getImage } from "gatsby-plugin-image";
import styled from "styled-components";
import { makeStyles } from '@material-ui/core/styles';

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

const useStyles = makeStyles({
    fbItem: {
        opacity: props => (props.selected || !props.disabled) ? 1 : 0.3,
    }
});

const FeedbackItem = (props) => {
    const classes = useStyles(props);
    const imgData = useStaticQuery(feedbackBtnsQuery);
    const node = imgData.allFile.edges.find(({ node }) => node.name === props.imgName).node;
    return (
        <Grid container spacing={ 2 } alignItems="center" direction="column">
            <Grid item >
                <GatsbyImage image={node.childImageSharp.gatsbyImageData} alt={ props.imgName } />
            </Grid>
            <Grid item >
                <Button variant="contained" id={ props.id } onClick={ props.onClick } color="primary" disabled={ props.disabled }>{ props.children }</Button>
            </Grid>
        </Grid>
    );
}

const Feedback = (props) => {
    const [selectedOption, setSelectedOption] = useState(null);
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
                    selectedOption === null ?
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
                        <FeedbackItem imgName={ imgName } id={ id } onClick={ () => setSelectedOption(idx) } disabled={ selectedOption !== null }
                         selected={ selectedOption === idx }>
                           { text }
                        </FeedbackItem>
                    </Grid>
                   )
                }
            </Grid>
        </>
    );
}

export default Feedback;