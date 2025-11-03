const { version } = require("../../package.json");
export const environment = {
	production: true,
	apiPath: "https://api.boklisten.no/",
	nextPath: "https://boklisten.no/",
	hmr: false,
	version: version,
	versionName: "",
};
