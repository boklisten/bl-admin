import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { MessengerSmsEditorComponent } from "./messenger-sms-editor.component";

describe("MessengerSmsEditorComponent", () => {
	let component: MessengerSmsEditorComponent;
	let fixture: ComponentFixture<MessengerSmsEditorComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [MessengerSmsEditorComponent],
		}).compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(MessengerSmsEditorComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it("should create", () => {
		expect(component).toBeTruthy();
	});
});
