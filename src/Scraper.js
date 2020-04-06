const puppeteer = require("puppeteer");

class Scraper {
	browser;
	page;

	constructor(usernameOrEmail, password) {
		this.username = usernameOrEmail;
		this.password = password;
	}

	async setBrowser() {
		this.browser = await puppeteer.launch({ headless: false });
		this.page = await this.browser.newPage();
		const pages = await this.browser.pages();
		pages[0].close();

		await this.goToPage("https://www.filmweb.pl/login");
	};

	async goToPage(url) {
		await this.page.goto(url, { waitUntil: "networkidle2" });
	}

	async closeBrowser() {
		this.browser.close();
	}

	async init() {
		await this.setBrowser();
		await this.closeBrowser();
	}
}

module.exports = Scraper;
