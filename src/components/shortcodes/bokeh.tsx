import React from "react";
import { Helmet } from "react-helmet";

interface BokehProps {
    plot: string
}

export function Bokeh(props: BokehProps) {
    const { plot } = props;
    const id = `${plot.replace(".json", "")}_${Math.random().toString(36).substring(2)}`;
    return (
        <>
        <Helmet>
            <link rel="stylesheet" href="https://cdn.pydata.org/bokeh/release/bokeh-1.0.2.min.css" type="text/css" />
            <script type="text/javascript" src="https://cdn.pydata.org/bokeh/release/bokeh-1.0.2.min.js">
            </script>
            <script type="text/javascript" async
                src="https://cdn.pydata.org/bokeh/release/bokeh-api-1.0.2.min.js">
            </script>
            <script type="text/javascript">
            {`
                var xmlhttp = new XMLHttpRequest();
                xmlhttp.onreadystatechange = function() {
                    if (this.readyState == 4 && this.status == 200) {
                        var item = JSON.parse(this.responseText);
                        if(typeof Bokeh !== 'undefined') {
                            document.getElementById("${id}").innerHTML = '';
                            Bokeh.embed.embed_item(item, "${ id }");
                        }
                    }
                };
                xmlhttp.open("GET", "${ plot }", true);
                xmlhttp.send(); 
            `}
            </script>
        </Helmet>
        <div id={ id }>
            <img src={ plot.replace(".json", ".png") } />
        </div>
        </>
    );
}
