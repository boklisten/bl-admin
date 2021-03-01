import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { InvoiceCreateItemListItemComponent } from "./invoice-create-item-list-item.component";

describe("InvoiceCreateItemListItemComponent", () => {
	let component: InvoiceCreateItemListItemComponent;
	let fixture: ComponentFixture<InvoiceCreateItemListItemComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [InvoiceCreateItemListItemComponent],
		}).compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(InvoiceCreateItemListItemComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it("should create", () => {
		expect(component).toBeTruthy();
	});
});
