import { ComponentFixture, TestBed, waitForAsync } from "@angular/core/testing";

import { UserDetailDownloadComponent } from "./user-detail-download.component";

describe("UserDetailDownloadComponent", () => {
	let component: UserDetailDownloadComponent;
	let fixture: ComponentFixture<UserDetailDownloadComponent>;

	beforeEach(
		waitForAsync(() => {
			TestBed.configureTestingModule({
				declarations: [UserDetailDownloadComponent],
			}).compileComponents();
		})
	);

	beforeEach(() => {
		fixture = TestBed.createComponent(UserDetailDownloadComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it("should create", () => {
		expect(component).toBeTruthy();
	});
});
