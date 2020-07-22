module.exports = {
    siteMetadata: {
        title: `Hoe Zit Het?`,
        description: `Verlichte uitleg wiskunde en fysica`,
        author: `@hoezithet`,
        siteURL: `https://hoezithet.nu`,
    },
    plugins: [
        `gatsby-plugin-typescript`,
        `gatsby-plugin-react-helmet`,
        {
            resolve: `gatsby-source-filesystem`,
            options: {
                name: `images`,
                path: `${__dirname}/src/images`,
            },
        },
        `gatsby-plugin-sass`,
        `gatsby-transformer-sharp`,
        `gatsby-plugin-sharp`,
        {
            resolve: `gatsby-plugin-manifest`,
            options: {
                name: `Hoe Zit Het?`,
                short_name: `hoezithet`,
                start_url: `/`,
                background_color: `#F4F4F4`,
                theme_color: `#FFB700`,
                display: `minimal-ui`,
                icon: `src/images/favicon.png`, // This path is relative to the root of the site.
            },
        },
        // this (optional) plugin enables Progressive Web App + Offline functionality
        // To learn more, visit: https://gatsby.dev/offline
        // `gatsby-plugin-offline`,
    ],
};
