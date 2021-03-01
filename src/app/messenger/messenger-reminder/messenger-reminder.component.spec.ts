import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { MessengerReminderComponent } from "./messenger-reminder.component";

describe("MessengerReminderComponent", () => {
	let component: MessengerReminderComponent;
	let fixture: ComponentFixture<MessengerReminderComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [MessengerReminderComponent],
		}).compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(MessengerReminderComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it("should create", () => {
		expect(component).toBeTruthy();
	});
});
