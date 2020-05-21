import React from "react";
import PropTypes from "prop-types";

import Header from "./header";
import Footer from "./footer";

import "semantic-ui-css/semantic.min.css";
import "./layout.css";

export interface LayoutProps {
    children: React.ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
    return (
        <>
            <Header siteTitle="Test" />
            <div>
                <main>{children}</main>
                <footer>
                    © {new Date().getFullYear()}, Built with
                    {` `}
                    <a href="https://www.gatsbyjs.org">Gatsby</a>
                </footer>
            </div>
            <Footer
                title="Hoe Zit Het? vzw"
                subtitle="ON 0736.486.356 RPR Brussel"
                facebookLink="https://www.facebook.com/hoezithet"
                githubLink="https://github.com/hoezithet/hoezithet"
            />
        </>
    );
};

Layout.propTypes = {
    children: PropTypes.node.isRequired,
};

export default Layout;
