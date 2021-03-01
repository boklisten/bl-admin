import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { InvoiceCreateItemListComponent } from "./invoice-create-item-list.component";

describe("InvoiceCreateItemListComponent", () => {
	let component: InvoiceCreateItemListComponent;
	let fixture: ComponentFixture<InvoiceCreateItemListComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [InvoiceCreateItemListComponent],
		}).compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(InvoiceCreateItemListComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it("should create", () => {
		expect(component).toBeTruthy();
	});
});
