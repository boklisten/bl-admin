import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { BlcTextblockEditComponent } from "./blc-textblock-edit.component";

describe("BlcTextblockEditComponent", () => {
	let component: BlcTextblockEditComponent;
	let fixture: ComponentFixture<BlcTextblockEditComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [BlcTextblockEditComponent],
		}).compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(BlcTextblockEditComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it("should create", () => {
		expect(component).toBeTruthy();
	});
});
