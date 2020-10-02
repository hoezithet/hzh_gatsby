import React from "react";
import { Helmet } from "react-helmet";
import { useStaticQuery, graphql } from "gatsby"

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

export function Bokeh(props: BokehProps) {
    const { plot } = props;
    const id = `_${plot.replace("/", "")}_${Math.random().toString(36).substring(2)}`;

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
        return <></>;
    }

    const plotJsonEdge = data.allFile.edges.find( ({ node }) =>
        node.absolutePath.endsWith(`${plot}.json`)
    );
    const plotImgEdge = data.allFile.edges.find( ({ node }) => 
        node.absolutePath.endsWith(`${plot}.png`)
    );

    if (!plotJsonEdge || !plotImgEdge) {
        return <></>;
    }

    const plotJsonURL = plotJsonEdge.node.publicURL;
    const plotImgURL = plotImgEdge.node.publicURL;

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
				xmlhttp.open("GET", "${plotJsonURL}", true);
				xmlhttp.send(); 
            `}
            </script>
        </Helmet>
        <div id={ id }>
            <img src={ plotImgURL } />
        </div>
        </>
    );
}
