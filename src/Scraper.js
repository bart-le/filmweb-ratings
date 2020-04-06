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

	async login(usernameOrEmail, password) {
		await this.page.waitForSelector(".rodoBoard", { visible: true });
		await this.page.click(".fwBtn--gold");
		await this.page.click(".authbutton--filmweb");

		await this.page.type("[name='j_username']", usernameOrEmail);
		await this.page.type("[name='j_password']", password);
		await this.page.click(".authButton--submit");
		await this.setUsername();
	}

	async setUsername() {
		await this.page.waitForSelector("#userAvatar > a", { visible: true });

		this.username = await this.page.$$eval("#userAvatar > a", a =>
			a.map(href => href.getAttribute("href")));
	}

	async goToPage(url) {
		await this.page.goto(url, { waitUntil: "networkidle2" });
	}

	async closeBrowser() {
		this.browser.close();
	}

	async init() {
		await this.setBrowser();
		await this.login(this.username, this.password);
		await this.closeBrowser();
	}
}

module.exports = Scraper;
