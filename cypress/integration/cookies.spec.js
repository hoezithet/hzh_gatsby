context("Cookies", () => {
    beforeEach(() => {
        cy.visit("/lessen");
        cy.clearCookies();
    });

    it("sets all cookies when user agrees", () => {
        cy.getCookie("gatsby-gdpr-google-tagmanager").should("be.null");
        cy.getCookie("gatsby-gdpr-google-analytics").should("be.null");

        cy.get("#accept-cookies-btn").click();

        cy.getCookie("gatsby-gdpr-google-tagmanager").should("have.property", "value", "true");
        cy.getCookie("gatsby-gdpr-google-analytics").should("have.property", "value", "true");
    });

    it("does not allow analytics when users chooses so", () => {
        cy.getCookie("gatsby-gdpr-google-tagmanager").should("be.null");
        cy.getCookie("gatsby-gdpr-google-analytics").should("be.null");

        cy.get("#adjust-cookies-btn").click();
        cy.get("#analytics-cookies-checkbox").click();
        cy.get("#accept-cookies-btn").click();

        cy.getCookie("gatsby-gdpr-google-tagmanager").should("have.property", "value", "true");
        cy.getCookie("gatsby-gdpr-google-analytics").should("have.property", "value", "false");
    });

    it("does not allow tagmanager when users chooses so", () => {
        cy.getCookie("gatsby-gdpr-google-tagmanager").should("be.null");
        cy.getCookie("gatsby-gdpr-google-analytics").should("be.null");

        cy.get("#adjust-cookies-btn").click();
        cy.get("#tagmanager-cookies-checkbox").click();
        cy.get("#accept-cookies-btn").click();

        cy.getCookie("gatsby-gdpr-google-tagmanager").should("have.property", "value", "false");
        cy.getCookie("gatsby-gdpr-google-analytics").should("have.property", "value", "true");
    });

    it("does not allow any cookies when users chooses so", () => {
        cy.getCookie("gatsby-gdpr-google-tagmanager").should("be.null");
        cy.getCookie("gatsby-gdpr-google-analytics").should("be.null");

        cy.get("#adjust-cookies-btn").click();
        cy.get("#analytics-cookies-checkbox").click();
        cy.get("#tagmanager-cookies-checkbox").click();
        cy.get("#accept-cookies-btn").click();

        cy.getCookie("gatsby-gdpr-google-tagmanager").should("have.property", "value", "false");
        cy.getCookie("gatsby-gdpr-google-analytics").should("have.property", "value", "false");
    });

    it("shows info on cookies when user clicks info link", () => {
        cy.get("#cookie-consent-text a").click();
        cy.url().should("include", "/cookies");
    });
});
