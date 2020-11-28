import React from "react";
import Layout from '../components/layout';
import notFoundImg from '../images/404/404.png';
import styled from "styled-components";

const Img = styled.img`
    margin: auto;
    width: 50%;
`

export default function NotFoundPage() {
    const crumbs = [{
        slug: "",
        title: "404"
    }];
    return (
        <Layout crumbs={ crumbs }>
            <Img src={ notFoundImg } />
            <h1>Hier zit je niet goed...</h1>
            <p>
                De pagina waar je naar surfte, bestaat helaas niet...
            </p>
            <p>
                Terug naar de <a href="javascript:history.back()">vorige pagina</a>!
            </p>
        </Layout>
    );
}
