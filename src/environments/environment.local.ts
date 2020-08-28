const { version } = require("../../package.json");
export const environment = {
	production: false,
	apiPath: "http://localhost:1337/",
	hmr: true,
	version: version
};
