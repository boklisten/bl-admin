import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { BlcEditDateValueComponent } from "./blc-edit-date-value.component";
import { Pipe } from "@angular/core";
import { FormsModule } from "@angular/forms";

@Pipe({ name: "blDate" })
class BlDateStub {}

describe("BlcEditDateValueComponent", () => {
	let component: BlcEditDateValueComponent;
	let fixture: ComponentFixture<BlcEditDateValueComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [BlcEditDateValueComponent, BlDateStub],
			imports: [FormsModule],
		}).compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(BlcEditDateValueComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it("should create", () => {
		expect(component).toBeTruthy();
	});
});
