//import { version } from "../../package.json";
const { version } = require("../../package.json");
export const environment = {
	production: false,
	apiPath: "http://api.test.boklisten.no/",
	hmr: false,
	version: version,
	versionName: "DEV"
};
