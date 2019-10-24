import { enableProdMode } from "@angular/core";
import { platformBrowserDynamic } from "@angular/platform-browser-dynamic";

import { AppModule } from "./app/app.module";
import { environment } from "./environments/environment";
import { hmrBootstrap } from "./hmr";

if (environment.production) {
	enableProdMode();
}

if (environment.hmr) {
	if (module["hot"]) {
		hmrBootstrap(
			module,
			() => platformBrowserDynamic().bootstrapModule(AppModule) as any
		);
	} else {
		console.error("HMR is not enabled for webpack-dev-server!");
		console.log("Are you using the --hmr flag for ng serve?");
	}
} else {
	platformBrowserDynamic()
		.bootstrapModule(AppModule)
		.catch(err => console.log(err));
}
