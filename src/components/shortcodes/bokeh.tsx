import React from "react";
import { Helmet } from "react-helmet";
import { useStaticQuery, graphql } from "gatsby"
import Grid from "@material-ui/core/Grid";

interface BokehProps {
    plot: string
}

interface PlotData {
    allFile: {
        edges: {
            node: {
                publicURL: string;
                absolutePath: string;
            }
        }[]
    }
}

function getPlotUrl(props: BokehProps): {jsonURL: string|undefined; imgURL: string|undefined;} {
    const { plot } = props;

    const data: PlotData = useStaticQuery(graphql`
    {
      allFile(filter: {absolutePath: {glob: "**/plt/*.(json|png)"}}) {
          edges {
              node {
                  publicURL
                  absolutePath
              }
          }
      }
    }`);

    if (data.allFile.edges.length === 0) {
        return {jsonURL: undefined, imgURL: undefined};
    }

    const plotJsonEdge = data.allFile.edges.find( ({ node }) =>
        node.absolutePath.endsWith(`${plot}.json`)
    );
    const plotImgEdge = data.allFile.edges.find( ({ node }) => 
        node.absolutePath.endsWith(`${plot}.png`)
    );

    if (!plotJsonEdge || !plotImgEdge) {
        return {jsonURL: undefined, imgURL: undefined};
    }

    const plotJsonURL = plotJsonEdge.node.publicURL;
    const plotImgURL = plotImgEdge.node.publicURL;
    return {jsonURL: plotJsonURL, imgURL: plotImgURL};
}

function BokehBare(props: BokehProps) {
    const { imgURL } = getPlotUrl(props);
    return (
        <Grid container justify="center" >
            <Grid item >
                <img src={ imgURL } />
            </Grid>
        </Grid>
    );
}

const Bokeh = (props: BokehProps) => {
    const id = `_${props.plot.replace("/", "")}_${Math.random().toString(36).substring(2)}`;
    const {jsonURL, imgURL} = getPlotUrl(props);
    return (
        <>
        <Helmet>
            <script type="text/javascript">
            {`
				var xmlhttp = new XMLHttpRequest();
				xmlhttp.onreadystatechange = function() {
					if (this.readyState == 4 && this.status == 200) {
						var item = JSON.parse(this.responseText);
						if(typeof Bokeh !== 'undefined') {
							document.getElementById("${id}").innerHTML = '';
							Bokeh.embed.embed_item(item, "${id}");
						}
					}
				};
				xmlhttp.open("GET", "${jsonURL}", true);
				xmlhttp.send(); 
            `}
            </script>
        </Helmet>
        <Grid container justify="center" >
        <Grid item xs={ 10 } md={ 6 }>
            <div id={ id }> 
                <img src={ imgURL } />
            </div>
        </Grid>
        </Grid>
        </>
    );
}

export { Bokeh, BokehBare };