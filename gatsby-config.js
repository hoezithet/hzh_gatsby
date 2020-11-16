module.exports = {
    siteMetadata: {
        organization: {
            name: `Hoe Zit Het?`,
            legalName: `Hoe Zit Het? vzw`,
            founder: `Floris De Feyter`,
            foundingDate: `2019`,
            logo: `https://hoezithet.nu/images/favicon.png`,
        },
        title: `Hoe Zit Het?`,
        siteUrl: `https://hoezithet.nu`,
        description: `Verlichte uitleg wiskunde en fysica`,
        tags: [`uitleg`, `wiskunde`, `fysica`],
        email: `hallo@hoezithet.nu`,
        twitterUsername: `@flo_defeyter`,
        socials: [`https://github.com/hoezithet`, `https://fb.me/hoezithet`],
        lang: `nl`,
    },
    plugins: [
        `gatsby-plugin-typescript`,
        `gatsby-plugin-react-helmet`,
        `gatsby-plugin-sitemap`,
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
        {
            resolve: `gatsby-plugin-gdpr-cookies`,
            options: {
                googleAnalytics: {
                    trackingId: "UA-133189848-1",
                    anonymize: true,
                    allowAdFeatures: false,
                },
                googleTagManager: {
                    trackingId: "GTM-KDR7S6V",
                },
                facebookPixel: {
                    pixelId: "",
                },
                environments: ["production", "development"],
            },
        },
        {
            resolve: `gatsby-source-filesystem`,
            options: {
                name: `content`,
                path: `${__dirname}/src/content`,
            },
        },
        {
            resolve: `gatsby-plugin-mdx`,
            options: {
                gatsbyRemarkPlugins: [
                    `gatsby-remark-autolink-headers`,
                    {
                        resolve: `gatsby-remark-katex`,
                        options: {
                            // Add any KaTeX options from https://github.com/KaTeX/KaTeX/blob/master/docs/options.md here
                            macros: {
                                "\\deg": "^{\\circ}",
                                "\\norm": ["\\lVert#1\\rVert", 1],
                                "\\breq": "\\stackrel{\\text{BR}}{=}",
                                "\\darkred": "\\color{e7040f}",
                                "\\red": "\\color{ff4136}",
                                "\\lightred": "\\color{ff725c}",
                                "\\orange": "\\color{ff6300}",
                                "\\gold": "\\color{ffb700}",
                                "\\yellow": "\\color{ffde37}",
                                "\\lightyellow": "\\color{fbf1a9}",
                                "\\purple": "\\color{5e2ca5}",
                                "\\lightpurple": "\\color{a463f2}",
                                "\\darkpink": "\\color{d5008f}",
                                "\\hotpink": "\\color{ff41b4}",
                                "\\pink": "\\color{ff80cc}",
                                "\\lightpink": "\\color{ffa3d7}",
                                "\\darkgreen": "\\color{137752}",
                                "\\green": "\\color{19a974}",
                                "\\lightgreen": "\\color{9eebcf}",
                                "\\navy": "\\color{001b44}",
                                "\\darkblue": "\\color{00449e}",
                                "\\blue": "\\color{357edd}",
                                "\\lightblue": "\\color{96ccff}",
                                "\\lightestblue": "\\color{cdecff}",
                                "\\washedblue": "\\color{f6fffe}",
                                "\\washedgreen": "\\color{e8fdf5}",
                                "\\washedyellow": "\\color{fffceb}",
                                "\\washedred": "\\color{ffdfdf}",
                                "\\grey": "\\color{d3d3d3}",
                                "\\gray": "\\color{d3d3d3}",

                                "\\dblue": "\\color{00449e}",
                                "\\black": "\\color{000000}",
                                "\\pos": "\\color{19a974}",
                                "\\neg": "\\color{e7040f}",
                                "\\neut": "\\color{357edd}",
                                "\\atten": "\\color{ff6300}",
                                "\\link": "\\color{357edd}",

                                "\\clra": "\\color{ff6300}",
                                "\\clrb": "\\color{00449e}",
                                "\\clrc": "\\color{d5008f}",
                                "\\clrd": "\\color{e7040f}",
                                "\\clre": "\\color{19a974}",

                                "\\mute": "\\color{d3d3d3}",

                                "\\si": "\\text",
                            },
                            colorIsTextColor: true,
                        },
                    },
                ],
            },
        },
        {
            resolve: `gatsby-theme-material-ui`,
        },
        `gatsby-plugin-styled-components`,
        `gatsby-plugin-catch-links`,
    ],
};
