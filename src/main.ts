import { enableProdMode } from "@angular/core";
import { platformBrowserDynamic } from "@angular/platform-browser-dynamic";
import * as Sentry from "@sentry/angular";
import { Integrations } from "@sentry/tracing";
import { AppModule } from "./app/app.module";
import { environment } from "./environments/environment";

Sentry.init({
  dsn: "https://7bf895badc0c44d09ffadfeff7589899@o569888.ingest.sentry.io/5734603",
  integrations: [
    new Integrations.BrowserTracing({
      tracingOrigins: ["localhost", "https://bladmin.boklisten.no"],
      routingInstrumentation: Sentry.routingInstrumentation,
    }),
  ],

  // Set tracesSampleRate to 1.0 to capture 100%
  // of transactions for performance monitoring.
  // We recommend adjusting this value in production
  tracesSampleRate: 1.0,
});

if (environment.production) {
	enableProdMode();
}

platformBrowserDynamic()
	.bootstrapModule(AppModule)
	.catch((err) => console.log(err));
