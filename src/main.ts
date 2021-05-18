import { enableProdMode } from "@angular/core";
import { platformBrowserDynamic } from "@angular/platform-browser-dynamic";
import * as Sentry from "@sentry/angular";
import { Integrations } from "@sentry/tracing";
import { AppModule } from "./app/app.module";
import { environment } from "./environments/environment";

if (environment.production) {
	Sentry.init({
		dsn:
			"https://7bf895badc0c44d09ffadfeff7589899@o569888.ingest.sentry.io/5734603",
		integrations: [
			new Integrations.BrowserTracing({
				tracingOrigins: ["https://bladmin.boklisten.no"],
				routingInstrumentation: Sentry.routingInstrumentation,
			}),
		],

		// Set tracesSampleRate to 1.0 to capture 100%
		// of transactions for performance monitoring.
		// We recommend adjusting this value in production
		tracesSampleRate: 1.0,
	});
	document.write(
		`
      <script type="text/javascript">
			(function (h, o, t, j, a, r) {
				h.hj =
					h.hj ||
					function () {
						(h.hj.q = h.hj.q || []).push(arguments);
					};
				h._hjSettings = { hjid: 2367665, hjsv: 6 };
				a = o.getElementsByTagName("head")[0];
				r = o.createElement("script");
				r.async = 1;
				r.src = t + h._hjSettings.hjid + j + h._hjSettings.hjsv;
				a.appendChild(r);
			})(
				window,
				document,
				"https://static.hotjar.com/c/hotjar-",
				".js?sv="
			);
      </script>
    `
	);

	enableProdMode();
}

platformBrowserDynamic()
	.bootstrapModule(AppModule)
	.catch((err) => console.log(err));
