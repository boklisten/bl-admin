//import { version } from "../../package.json";
const { version } = require("../../package.json");
export const environment = {
	production: false,
	apiPath: "https://blapi.test.boklisten.no/",
	hmr: false,
	version: version,
	versionName: "DEV"
};
