import React from "react";
import PropTypes from "prop-types";

export default function HTML(props) {
    return (
        <html {...props.htmlAttributes}>
            <head>
                <meta charSet="utf-8" />
                <meta httpEquiv="x-ua-compatible" content="ie=edge" />
                <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no" />
                <link rel="stylesheet" href="https://cdn.bokeh.org/bokeh/release/bokeh-1.0.2.min.css" type="text/css" />
                <script
                    defer
                    type="text/javascript"
                    src="https://cdn.bokeh.org/bokeh/release/bokeh-1.0.2.min.js"
                    crossOrigin="anonymous"
                ></script>
                <script
                    defer
                    type="text/javascript"
                    src="https://cdn.bokeh.org/bokeh/release/bokeh-api-1.0.2.min.js"
                    crossOrigin="anonymous"
                ></script>
                {props.headComponents}
            </head>
            <body {...props.bodyAttributes}>
                {props.preBodyComponents}
                <div key={`body`} id="___gatsby" dangerouslySetInnerHTML={{ __html: props.body }} />
                {props.postBodyComponents}
            </body>
        </html>
    );
}

HTML.propTypes = {
    htmlAttributes: PropTypes.object,
    headComponents: PropTypes.array,
    bodyAttributes: PropTypes.object,
    preBodyComponents: PropTypes.array,
    body: PropTypes.string,
    postBodyComponents: PropTypes.array,
};
