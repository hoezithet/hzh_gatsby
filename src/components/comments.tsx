import React from "react";
import { Helmet } from "react-helmet";

export default function Comments() {
    return (
        <>
        <h2 id="comments">Vragen en reacties</h2>
        <div id="commento"></div>
        <Helmet>
            <script defer
                src="https://commento.hoezithet.nu/js/commento.js"
                data-no-fonts="true"
                data-css-override="/css/commento.css">
            </script>
            <script>
                {`
                var katexLoaded = false;
                var autoRenderLoaded = false;

                function renderCommentoMath() {
                    if (!katexLoaded || !autoRenderLoaded) {
                        return;
                    }
                    try {
                        renderMathInElement(document.getElementById('commento'), {
                            delimiters: [
                                {left: "$$", right: "$$", display: true},
                                {left: "$", right: "$", display: false},
                                {left: "\\(", right: "\\)", display: false},
                                {left: "\\[", right: "\\]", display: true}
                            ]
                        });
                    } catch (error) {
                        console.log('Commento math rendering failed.');
                    }
                }

                var observer = new MutationObserver(function(mutList, observer) {
                    renderCommentoMath();
                });

                observer.observe(document.getElementById("commento"), { attributes: true, childList: true, subtree: true });
                `}
            </script>
            <link rel="stylesheet"
                href="https://cdn.jsdelivr.net/npm/katex@0.12.0/dist/katex.min.css"
                integrity="sha384-AfEj0r4/OFrOo5t7NnNe46zW/tFgW6x/bCJG8FqQCEo3+Aro6EYUG4+cU+KJWu/X"
                crossorigin="anonymous" />
            <script defer
                src="https://cdn.jsdelivr.net/npm/katex@0.12.0/dist/katex.min.js"
                integrity="sha384-g7c+Jr9ZivxKLnZTDUhnkOnsh30B4H0rpLUpJ4jAIKs4fnJI+sEnkvrMWph2EDg4"
                crossorigin="anonymous"
                onload="katexLoaded = true; renderCommentoMath();">
            </script>
            <script defer
                src="https://cdn.jsdelivr.net/npm/katex@0.12.0/dist/contrib/auto-render.min.js"
                integrity="sha384-mll67QQFJfxn0IYznZYonOWZ644AWYC+Pt2cHqMaRhXVrursRwvLnLaebdGIlYNa"
                crossorigin="anonymous"
                onload="autoRenderLoaded = true; renderCommentoMath();">
            </script>
        </Helmet>
</>
);
}
