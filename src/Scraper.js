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

	async scrapePage(url) {
		await this.goToPage(url);

		await this.page.waitForSelector(".userVotesPage--userVotes");

		const films = await this.page.$$eval("div.myVoteBox__mainBox", films => films.map(film => ({
			title: film.querySelector("h3.filmPreview__title").textContent,
			userRating: film.querySelector(".myVoteBox__mainBox .userRate__rate").textContent,
			communityRating: film.querySelector("span.rateBox__rate").textContent,
			year: film.querySelector(".filmPreview__year").textContent,
			genre: Array.from(Array.from(film.querySelectorAll(".filmPreview__info--genres ul"))
			.map(genres => Array.from(genres.querySelectorAll("li a"))
			.map(genre => genre.textContent)))
			.map(genres => genres.join(" / "))[0]
		})));

		const nextPageNumber = parseInt(url.match(/page=(\d+)$/)[1], 10) + 1;
		console.log(nextPageNumber);
		return films;
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
		await this.scrapePage(`https://www.filmweb.pl${this.username[0]}/films?page=1`);
		await this.closeBrowser();
	}
}

module.exports = Scraper;
