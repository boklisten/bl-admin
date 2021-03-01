import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { MessengerGenericComponent } from "./messenger-generic.component";

describe("MessengerGenericComponent", () => {
	let component: MessengerGenericComponent;
	let fixture: ComponentFixture<MessengerGenericComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [MessengerGenericComponent],
		}).compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(MessengerGenericComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it("should create", () => {
		expect(component).toBeTruthy();
	});
});
