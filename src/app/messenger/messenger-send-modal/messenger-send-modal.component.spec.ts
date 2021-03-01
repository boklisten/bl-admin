import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { MessengerSendModalComponent } from "./messenger-send-modal.component";

describe("MessengerSendModalComponent", () => {
	let component: MessengerSendModalComponent;
	let fixture: ComponentFixture<MessengerSendModalComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [MessengerSendModalComponent],
		}).compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(MessengerSendModalComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it("should create", () => {
		expect(component).toBeTruthy();
	});
});
