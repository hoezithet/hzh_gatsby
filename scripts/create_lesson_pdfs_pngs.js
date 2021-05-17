const puppeteer = require('puppeteer');
const glob = require('glob');
const path = require('path');

(async () => {
    const browser = await puppeteer.launch({timeout: 0});
    const page = await browser.newPage();
    page.setDefaultTimeout(0);
    const files = glob.sync("public/bare/lessen/*/*/*/index.html");
    console.log(`Found ${files.length} files`);

    for (const f of files) {
        const slug = f.split("/").slice(-6, -1).join("/");
        const htmlPath = `https://hoezithet.nu/${slug}/`;
        console.log(`Fetching page ${htmlPath}`);
        await page.goto(htmlPath, {waitUntil: "networkidle2"});
        const title = await page.title();
        
        console.log("Saving pdf");
        const footerHtml = `
            <div style="font-family: Quicksand; font-size: 10px; padding-right: 100px; padding-left: 100px; padding-bottom: 20px; display: flex; justify-content: space-between; width: 100%;">
                <span>Hoe Zit Het? - <span class="title"></span></span> <span>p. <span class="pageNumber"></span>/<span class="totalPages"></span></span>
            </div>
        `;

        // E.g. /lessen/wiskunde/afgeleiden_1/afgeleide_functie
        // becomes afgeleiden_1-afgeleide_functie
        const pdfStem = slug.split('/').slice(3).join("-");

        const lessonPath = f.replace("index.html", "").replace("/bare", "");

        await page.pdf({
            path: `${lessonPath}${pdfStem}.pdf`,
            format: 'A4',
            printBackground: true,
            margin: {
                top: "100px",
                left: "150px",
                right: "150px",
                bottom: "100px"
            },
            displayHeaderFooter: true,
            footerTemplate: footerHtml,
            headerTemplate: '<span></span>',
        });

        const svgs = await page.$$(".plot");
        for (const [i, svg] of svgs.entries()) {
            const classNames = svg["_remoteObject"]["description"].split(".");
            const plotName = classNames.find(c => c.match(/plot_[0-9]+\b/g));
            console.log(plotName);
            await svg.screenshot({path: `${lessonPath}plot_${i + 1}.png`});
        }
    }
    await browser.close();
})();
