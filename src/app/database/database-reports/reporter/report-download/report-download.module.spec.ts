import { ReportDownloadModule } from "./report-download.module";

describe("ReportDownloadModule", () => {
	let reportDownloadModule: ReportDownloadModule;

	beforeEach(() => {
		reportDownloadModule = new ReportDownloadModule();
	});

	it("should create an instance", () => {
		expect(reportDownloadModule).toBeTruthy();
	});
});
