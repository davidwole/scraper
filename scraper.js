import puppeteer from "puppeteer";
import { sendDiscordMessage } from "./discord.js";
import { timeAgo } from "./utils/time.js";

const craigslistLinks = [
  "https://limaohio.craigslist.org/search/yorkshire-oh/cpg?cc=gb&lang=en&lat=40.3098&lon=-84.4664&search_distance=1000#search=1~thumb~0~0",
  "https://limaohio.craigslist.org/search/yorkshire-oh/crg?cc=gb&lang=en&lat=40.3098&lon=-84.4664&search_distance=1000#search=1~thumb~0~0",
  "https://ogden.craigslist.org/search/mountain-view-wy/cpg?cc=gb&lang=en&lat=41.1804&lon=-110.2139&search_distance=1000#search=1~thumb~0~0",
  "https://ogden.craigslist.org/search/mountain-view-wy/crg?cc=gb&lang=en&lat=41.1804&lon=-110.2139&search_distance=1000#search=1~thumb~0~0",
];

async function scrape() {
  let browser;
  try {
    browser = await puppeteer.launch({
      args: ["--no-sandbox"],
      headless: true,
      defaultViewport: false,
      timeout: 0,
    });

    const processLink = async (url) => {
      const page = await browser.newPage();
      await page.goto(url);
      await page.waitForSelector(".result-node");

      const listings = await page.evaluate(() => {
        const elements = document.querySelectorAll(".result-node");
        const data = [];

        elements.forEach((el) => {
          const title =
            el
              .querySelector("a.cl-app-anchor.text-only.posting-title")
              ?.innerText.trim() || null;
          const posted =
            el.querySelector(".meta span[title]")?.getAttribute("title") ||
            null;
          const link =
            el.querySelector("a.cl-app-anchor.text-only.posting-title")?.href ||
            null;

          data.push({
            title,
            posted,
            link,
          });
        });

        return data;
      });

      await page.close();
      return listings;
    };

    const allListings = await Promise.all(
      craigslistLinks.map((link) => processLink(link))
    );

    const timeFilter = new Date(Date.now() - 10 * 60 * 1000);

    const recentListings = allListings
      .flat()
      .filter((item) => new Date(item.posted) > timeFilter);

    if (recentListings.length === 0) {
      console.log(`No New Listings`);
      await browser.close();
      return;
    }

    for (const listing of recentListings) {
      const message = `\n**Title:** **${
        listing.title
      }**\n\n**Posted:** ${timeAgo(listing.posted)}\n\n**Link:** ${
        listing.link
      }`;
      await sendDiscordMessage(message);
    }

    console.log(recentListings);
  } catch (error) {
    console.error("An error occurred:", error.message || error);
  } finally {
    if (browser) {
      await browser.close();
    }
  }
}

scrape();
