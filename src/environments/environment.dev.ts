//import { version } from "../../package.json";
const { version } = require("../../package.json");
export const environment = {
	production: false,
	apiPath: "https://staging.api.boklisten.no/",
	hmr: false,
	version: version,
	versionName: "DEV",
};
