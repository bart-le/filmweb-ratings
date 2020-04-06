const Scraper = require("./Scraper");

const params = process.argv.slice(2);
const [usernameOrEmail, password] = params;

(async () => {
	const scraper = new Scraper(usernameOrEmail, password);

	if (params.length === 2) {
		try {
			await scraper.init();
		} catch (e) {
			console.log("Invalid credentials.");
		}
	} else {
		console.log("Try again using two parameters. First as login and second as your password.")
	}
})();
