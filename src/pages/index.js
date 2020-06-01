import React from "react";
import { Link } from "gatsby";

import Layout from "../components/layout";
import SEO from "../components/seo";
import HzhHero from "../components/general/HzhHero";
import student from "../images/student.svg";
import COLORS from "../colors";

const IndexPage = () => (
    <Layout>
        <SEO title="Hoe Zit Het?" />
        <HzhHero
            image={student}
            text={"Dit is een lange tekst die naast de afbeelding zal staan."}
            title={"Test hero component"}
            backgroundColor={COLORS.HOT_PINK}
        />
        <HzhHero
            image={student}
            imagePosition="right"
            text={"Dit is een tweede lange tekst die naast de afbeelding zal staan."}
            title={"Test hero 2 component"}
        />
        <Link to="/page-2/">Go to page 2</Link>
    </Layout>
);

export default IndexPage;
