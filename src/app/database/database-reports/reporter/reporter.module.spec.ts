import { ReporterModule } from "./reporter.module";

describe("ReporterModule", () => {
	let reporterModule: ReporterModule;

	beforeEach(() => {
		reporterModule = new ReporterModule();
	});

	it("should create an instance", () => {
		expect(reporterModule).toBeTruthy();
	});
});
