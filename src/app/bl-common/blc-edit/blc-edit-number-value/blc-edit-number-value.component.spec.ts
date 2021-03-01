import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { BlcEditNumberValueComponent } from "./blc-edit-number-value.component";
import { FormsModule } from "@angular/forms";

describe("BlcEditNumberValueComponent", () => {
	let component: BlcEditNumberValueComponent;
	let fixture: ComponentFixture<BlcEditNumberValueComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [BlcEditNumberValueComponent],
			imports: [FormsModule],
		}).compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(BlcEditNumberValueComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it("should create", () => {
		expect(component).toBeTruthy();
	});
});
