const { version } = require("../../package.json");
export const environment = {
	production: false,
	apiPath: "http://localhost:1337/",
	nextPath: "http://localhost:3000/",
	hmr: true,
	version: version,
	versionName: "LOCAL",
};
