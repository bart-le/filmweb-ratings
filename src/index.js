const params = process.argv.slice(2);
const [usernameOrEmail, password] = params;

(async () => {
	if (params.length === 2) {
		try {
			console.log(usernameOrEmail, password);
		} catch (e) {
			console.log("Invalid credentials.");
		}
	} else {
		console.log("Try again using two parameters. First as login and second as your password.")
	}
})();
