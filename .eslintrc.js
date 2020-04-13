module.exports = {
	parserOptions: {
		ecmaVersion: 6,
		sourceType: "module"
	},
	env: {
		"browser": true,
	},
	extends: "eslint:recommended",
	rules: {
		"indent": [2, "tab"],
		"semi": [2, "always"],
		"no-console": [0]
	}
};
