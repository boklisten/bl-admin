import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { BlcDatatableStringCellComponent } from "./blc-datatable-string-cell.component";
import { FormsModule } from "@angular/forms";

describe("BlcDatatableStringCellComponent", () => {
	let component: BlcDatatableStringCellComponent;
	let fixture: ComponentFixture<BlcDatatableStringCellComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [BlcDatatableStringCellComponent],
			imports: [FormsModule],
		}).compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(BlcDatatableStringCellComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it("should create", () => {
		expect(component).toBeTruthy();
	});
});
